import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { FoundDex, Token as QuipuswapSdkToken } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { noop } from 'rxjs';

import { EMPTY_POOL_AMOUNT } from '@config/constants';
import { NETWORK_ID, TOKEN_TO_TOKEN_DEX } from '@config/enviroment';
import { TEZOS_TOKEN, TEZOS_TOKEN_SLUG, TEZOS_TOKEN_SYMBOL } from '@config/tokens';
import { useAccountPkh, useEstimationToolkit, useTezos } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { UnexpectedEmptyValueError } from '@shared/errors';
import {
  defined,
  fromDecimals,
  getAddLiquidityMessage,
  getDollarEquivalent,
  getInitializeLiquidityMessage,
  getTokenInputAmountCap,
  getTokenSlug,
  getTokenSymbol,
  isExist,
  isNull,
  isTokenFa2,
  isUndefined,
  toDecimals
} from '@shared/helpers';
import { useLoadingDecorator } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { Nullable, Optional, Token, Undefined } from '@shared/types';
import { useConfirmOperation } from '@shared/utils';

import {
  addLiquidityTez,
  addLiquidityTokenToToken,
  addPairTokenToToken,
  initializeLiquidityTez
} from '../blockchain/send-transaction';
import { calculatePoolAmount, checkIsPoolNotExists, removeExtraZeros, sortTokensContracts } from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { validations } from '../validators';
import { LastChangedToken } from './last-changed-token.enum';
import { PairInfo } from './pair-info.interface';

const EMPTY_BALANCE_AMOUNT = 0;

export const getPairId = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>,
  pairInfo: Optional<PairInfo>,
  isPoolNotExists: boolean
) => {
  if (!dex || isPoolNotExists) {
    return null;
  }

  if (pairInfo?.id) {
    return pairInfo?.id?.toFixed();
  }

  if ((tokenA && isTokenFa2(tokenA)) || (tokenB && isTokenFa2(tokenB))) {
    return '0';
  }

  return null;
};

export const useAddLiquidityService = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>,
  onTokenAChange: (token: Token) => void,
  onTokenBChange: (token: Token) => void
) => {
  const tezos = useTezos();
  const estimatedTezos = useEstimationToolkit();
  const accountPkh = useAccountPkh();
  const exchangeRates = useNewExchangeRates();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const { pairInfo, updatePairInfo, tokenAPool, tokenBPool } = usePairInfo(dex, tokenA, tokenB);
  const {
    tokenBalance: tokenABalance,
    updateTokenBalance: updateTokenABalance,
    clearBalance: clearBalanceA
  } = useLoadTokenBalance(tokenA);
  const {
    tokenBalance: tokenBBalance,
    updateTokenBalance: updateTokenBBalance,
    clearBalance: clearBalanceB
  } = useLoadTokenBalance(tokenB);
  const confirmOperation = useConfirmOperation();

  const [tokenAInput, setTokenAInput] = useState('');
  const [tokenBInput, setTokenBInput] = useState('');
  const [validationMessageTokenA, setValidationMessageTokenA] = useState<Undefined<string>>();
  const [validationMessageTokenB, setValidationMessageTokenB] = useState<Undefined<string>>();
  const [lastEditedInput, setLastEditedInput] = useState<Nullable<LastChangedToken>>(null);

  const isPoolNotExist = !isUndefined(pairInfo) && checkIsPoolNotExists(pairInfo);

  const tokensCalculations = (
    _tokenAInput: string,
    _tokenBInput: string,
    _tokenA: Token,
    _tokenB: Token,
    _pairInfo: Optional<PairInfo>,
    _tokenABalance: Nullable<BigNumber>,
    _tokenBBalance: Nullable<BigNumber>,
    _setTokenAInput: Dispatch<SetStateAction<string>>,
    _setTokenBInput: Dispatch<SetStateAction<string>>,
    _setValidationMessageTokenA: Dispatch<SetStateAction<Undefined<string>>>,
    _setValidationMessageTokenB: Dispatch<SetStateAction<Undefined<string>>>
  ) => {
    _setTokenAInput(_tokenAInput);

    if (_tokenAInput === '') {
      _setTokenBInput('');
      _setValidationMessageTokenA(undefined);
      _setValidationMessageTokenB(undefined);

      return;
    }
    const tokenABN = new BigNumber(_tokenAInput);

    const { decimals: decimalsA, symbol: symbolA } = _tokenA.metadata;
    const { decimals: decimalsB, symbol: symbolB } = _tokenB.metadata;

    const maxTokenAInput =
      _tokenABalance && BigNumber.maximum(_tokenABalance.minus(getTokenInputAmountCap(_tokenA)), EMPTY_BALANCE_AMOUNT);
    const validationA = validations(accountPkh, tokenABN, maxTokenAInput, _tokenAInput, decimalsA, symbolA);
    _setValidationMessageTokenA(validationA);

    if (isPoolNotExist || !_pairInfo) {
      return;
    }

    const { tokenAPool: _tokenAPool, tokenBPool: _tokenBPool, tokenA: pairTokenA } = _pairInfo;

    const isTokensOrderValid =
      _tokenA.contractAddress === pairTokenA.contractAddress && _tokenA.fa2TokenId === pairTokenA.fa2TokenId;
    const validTokenAPool = isTokensOrderValid ? _tokenAPool : _tokenBPool;
    const validTokenBPool = isTokensOrderValid ? _tokenBPool : _tokenAPool;

    const tokenBAmount = calculatePoolAmount(tokenABN, _tokenA, _tokenB, validTokenAPool, validTokenBPool);

    const maxTokenBInput =
      _tokenBBalance && BigNumber.maximum(_tokenBBalance.minus(getTokenInputAmountCap(_tokenB)), EMPTY_BALANCE_AMOUNT);
    const validationB = tokenBAmount
      ? validations(accountPkh, tokenBAmount, maxTokenBInput, _tokenBInput, decimalsB, symbolB)
      : undefined;

    _setValidationMessageTokenB(validationB);

    _setTokenBInput(tokenBAmount ? tokenBAmount.toFixed() : '');
  };

  useEffect(() => {
    if (!lastEditedInput || !tokenA || !tokenB) {
      return;
    }

    if (lastEditedInput === LastChangedToken.tokenA) {
      tokensCalculations(
        tokenAInput,
        tokenBInput,
        tokenA,
        tokenB,
        pairInfo,
        tokenABalance,
        tokenBBalance,
        setTokenAInput,
        setTokenBInput,
        setValidationMessageTokenA,
        setValidationMessageTokenB
      );
    } else {
      tokensCalculations(
        tokenBInput,
        tokenAInput,
        tokenB,
        tokenA,
        pairInfo,
        tokenBBalance,
        tokenABalance,
        setTokenBInput,
        setTokenAInput,
        setValidationMessageTokenB,
        setValidationMessageTokenA
      );
    }

    return noop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo, tokenABalance, tokenBBalance]);

  const handleSetTokenA = (token: Token) => {
    onTokenAChange(token);
    clearBalanceA();
    if (lastEditedInput === LastChangedToken.tokenA) {
      setTokenBInput('');
    } else {
      setTokenAInput('');
    }
  };

  const handleSetTokenB = (token: Token) => {
    onTokenBChange(token);
    clearBalanceB();
    if (lastEditedInput === LastChangedToken.tokenB) {
      setTokenAInput('');
    } else {
      setTokenBInput('');
    }
  };

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastEditedInput(LastChangedToken.tokenA);
    tokensCalculations(
      event.target.value,
      tokenBInput,
      defined(tokenA),
      defined(tokenB),
      pairInfo,
      tokenABalance,
      tokenBBalance,
      setTokenAInput,
      setTokenBInput,
      setValidationMessageTokenA,
      setValidationMessageTokenB
    );
  };

  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastEditedInput(LastChangedToken.tokenB);
    tokensCalculations(
      event.target.value,
      tokenAInput,
      defined(tokenB),
      defined(tokenA),
      pairInfo,
      tokenBBalance,
      tokenABalance,
      setTokenBInput,
      setTokenAInput,
      setValidationMessageTokenB,
      setValidationMessageTokenA
    );
  };

  const handleTokenABalance = (value: string) => {
    const { decimals } = defined(tokenA).metadata;
    const fixedValue = removeExtraZeros(value, decimals);

    setLastEditedInput(LastChangedToken.tokenA);
    tokensCalculations(
      fixedValue,
      tokenBInput,
      defined(tokenA),
      defined(tokenB),
      pairInfo,
      tokenABalance,
      tokenBBalance,
      setTokenAInput,
      setTokenBInput,
      setValidationMessageTokenA,
      setValidationMessageTokenB
    );
  };

  const handleTokenBBalance = (value: string) => {
    const { decimals } = defined(tokenB).metadata;
    const fixedValue = removeExtraZeros(value, decimals);

    setLastEditedInput(LastChangedToken.tokenB);
    tokensCalculations(
      fixedValue,
      tokenAInput,
      defined(tokenB),
      defined(tokenA),
      pairInfo,
      tokenBBalance,
      tokenABalance,
      setTokenBInput,
      setTokenAInput,
      setValidationMessageTokenB,
      setValidationMessageTokenA
    );
  };

  // TODO: Refactor this
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const investTokenToToken = async () => {
    if (!tezos || !accountPkh || !dex || !tokenA || !tokenB) {
      return;
    }

    const { isRevert } = sortTokensContracts(tokenA, tokenB);
    const pairTokenA = isRevert ? tokenB : tokenA;
    const pairTokenB = isRevert ? tokenA : tokenB;
    const pairInputA = isRevert ? tokenBInput : tokenAInput;
    const pairInputB = isRevert ? tokenAInput : tokenBInput;

    const tokenAInputUsd = Number(getDollarEquivalent(tokenAPool, exchangeRates[getTokenSlug(tokenA)]));
    const tokenBInputUsd = Number(getDollarEquivalent(tokenBPool, exchangeRates[getTokenSlug(tokenB)]));

    if (isPoolNotExist) {
      const addPairTokenToTokenOperation = await addPairTokenToToken(
        tezos,
        dex,
        accountPkh,
        pairTokenA,
        pairTokenB,
        pairInputA,
        pairInputB
      );

      if (addPairTokenToTokenOperation) {
        const tokenASymbol = getTokenSymbol(pairTokenA);
        const tokenBSymbol = getTokenSymbol(pairTokenB);

        const initializeLiquidityMessage = getInitializeLiquidityMessage(tokenASymbol, tokenBSymbol);

        const logData = {
          liquidity: {
            type: 'TOKEN_TO_TOKEN',
            tokenASymbol,
            tokenBSymbol,
            tokenASlug: getTokenSlug(pairTokenA),
            tokenBSlug: getTokenSlug(pairTokenB),
            pairInputA: Number(pairInputA),
            pairInputB: Number(pairInputB),
            tokenAInputUsd,
            tokenBInputUsd
          }
        };

        try {
          amplitudeService.logEvent('LIQUIDITY_INIT', logData);
          await confirmOperation(addPairTokenToTokenOperation.opHash, {
            message: initializeLiquidityMessage
          });
          amplitudeService.logEvent('LIQUIDITY_INIT_SUCCESS', logData);
        } catch (error) {
          amplitudeService.logEvent('LIQUIDITY_INIT_FAILED', { ...logData, error });
        }
      }
    } else {
      if (!pairInfo || !pairInfo.id) {
        throw new UnexpectedEmptyValueError('PairInfo');
      }

      const logData = {
        liquidity: {
          type: 'TOKEN_TO_TOKEN',
          contract: dex.contract.address,
          contractPairId: getPairId(dex, pairTokenA, pairTokenB, pairInfo, false),
          tokenASlug: getTokenSlug(pairTokenA),
          tokenBSlug: getTokenSlug(pairTokenB),
          tokenASymbol: getTokenSymbol(pairTokenA),
          tokenBSymbol: getTokenSymbol(pairTokenB),
          pairInputA: Number(pairInputA),
          pairInputB: Number(pairInputB),
          totalSupply: Number(pairInfo.totalSupply.toFixed()),
          tokenAPool: Number(pairInfo.tokenAPool.toFixed()),
          tokenBPool: Number(pairInfo.tokenBPool.toFixed()),
          transactionDeadline: Number(transactionDeadline.toFixed()),
          liquiditySlippage: Number(liquiditySlippage.toFixed()),
          tokenAInputUsd,
          tokenBInputUsd
        }
      };

      try {
        amplitudeService.logEvent('LIQUIDITY_ADD', logData);
        const addLiquidityTokenToTokenOperation = await addLiquidityTokenToToken(
          tezos,
          accountPkh,
          dex,
          pairInfo.id,
          pairInputA,
          pairTokenA,
          pairTokenB,
          pairInfo.totalSupply,
          pairInfo.tokenAPool,
          pairInfo.tokenBPool,
          transactionDeadline,
          liquiditySlippage
        );

        const tokenASymbol = getTokenSymbol(pairTokenA);
        const tokenBSymbol = getTokenSymbol(pairTokenB);

        const addLiquidityMessage = getAddLiquidityMessage(tokenASymbol, tokenBSymbol);

        await confirmOperation(addLiquidityTokenToTokenOperation.opHash, {
          message: addLiquidityMessage
        });
        amplitudeService.logEvent('LIQUIDITY_ADD_SUCCESS', logData);
      } catch (error) {
        amplitudeService.logEvent('LIQUIDITY_ADD_FAILED', { ...logData, error });
      }
    }

    setLastEditedInput(null);
    setTokenAInput('');
    setTokenBInput('');
    await Promise.all([updateTokenABalance(tokenA), updateTokenBBalance(tokenB), updatePairInfo(dex, tokenA, tokenB)]);
  };

  const investTezosToToken = async () => {
    if (
      !isExist(tezos) ||
      !isExist(accountPkh) ||
      isUndefined(dex) ||
      !isExist(tokenA) ||
      !isExist(tokenB) ||
      !isExist(estimatedTezos)
    ) {
      return;
    }

    const notTezToken = tokenA.contractAddress === TEZOS_TOKEN_SLUG ? tokenB : tokenA;
    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN_SLUG ? tokenAInput : tokenBInput;
    const notTezTokenInput = tokenA.contractAddress === TEZOS_TOKEN_SLUG ? tokenBInput : tokenAInput;
    const tezTokenBN = new BigNumber(tezTokenInput);
    const tezValue = toDecimals(tezTokenBN, TEZOS_TOKEN);

    const tezTokenInputUsd = Number(getDollarEquivalent(tezTokenInput, exchangeRates[TEZOS_TOKEN.contractAddress]));
    const notTezTokenInputUsd = Number(getDollarEquivalent(notTezTokenInput, exchangeRates[getTokenSlug(notTezToken)]));

    const shouldAddLiquidity =
      !isNull(dex) &&
      !isNull(tokenAPool) &&
      !isNull(tokenBPool) &&
      tokenAPool.gt(EMPTY_POOL_AMOUNT) &&
      tokenBPool.gt(EMPTY_POOL_AMOUNT);

    if (shouldAddLiquidity) {
      const fixedTokenAPoll = Number(fromDecimals(tokenAPool, tokenA).toFixed());
      const fixedTokenBPoll = Number(fromDecimals(tokenBPool, tokenB).toFixed());
      const fixedTokenAPollUds = Number(getDollarEquivalent(fixedTokenAPoll, exchangeRates[getTokenSlug(tokenA)]));
      const fixedTokenBPollUds = Number(getDollarEquivalent(fixedTokenBPoll, exchangeRates[getTokenSlug(tokenB)]));

      const logData = {
        liquidity: {
          type: 'TEZOS_TO_TOKEN',
          contract: dex.contract.address,
          contractPairId: getPairId(dex, tokenA, tokenB, pairInfo, false),
          tokenSlug: getTokenSlug(notTezToken),
          tokenSymbol: getTokenSymbol(notTezToken),
          tezTokenInput: Number(tezTokenInput),
          notTezTokenInput: Number(notTezTokenInput),
          tezTokenInputUsd,
          notTezTokenInputUsd,
          liquidityUsd: tezTokenInputUsd + notTezTokenInputUsd,
          fixedTokenAPoll,
          fixedTokenBPoll,
          fixedTokenAPollUds,
          fixedTokenBPollUds,
          tvlUsd: fixedTokenAPollUds + fixedTokenBPollUds
        }
      };

      try {
        amplitudeService.logEvent('LIQUIDITY_ADD', logData);
        const addLiquidityTezOperation = await addLiquidityTez(tezos, dex, tezValue, estimatedTezos);

        const notTezTokenSymbol = getTokenSymbol(notTezToken);

        const addLiquidityMessage = getAddLiquidityMessage(TEZOS_TOKEN_SYMBOL, notTezTokenSymbol);

        await confirmOperation(addLiquidityTezOperation.opHash, {
          message: addLiquidityMessage
        });
        amplitudeService.logEvent('LIQUIDITY_ADD_SUCCESS', logData);
      } catch (error) {
        amplitudeService.logEvent('LIQUIDITY_ADD_FAILED', logData);
      }
    } else {
      const token: QuipuswapSdkToken = {
        contract: notTezToken.contractAddress,
        id: notTezToken.fa2TokenId
      };
      const notTezTokenBN = new BigNumber(notTezTokenInput);
      const tokenBValue = toDecimals(notTezTokenBN, notTezToken);

      const logData = {
        liquidity: {
          type: 'TEZOS_TO_TOKEN',
          tokenSlug: getTokenSlug(notTezToken),
          tokenSymbol: getTokenSymbol(notTezToken),
          notTezTokenInput,
          tokenBValue: Number(tokenBValue.toFixed()),
          tezValue: Number(tezValue.toFixed()),
          tezTokenInputUsd,
          notTezTokenInputUsd,
          liquidityUsd: tezTokenInputUsd + notTezTokenInputUsd
        }
      };

      try {
        amplitudeService.logEvent('LIQUIDITY_INIT', logData);
        const initializeLiquidityTezOperation = await initializeLiquidityTez(
          tezos,
          NETWORK_ID,
          token,
          tokenBValue,
          tezValue
        );

        const notTezTokenSymbol = getTokenSymbol(notTezToken);

        const initializeLiquidityMessage = getInitializeLiquidityMessage(TEZOS_TOKEN_SYMBOL, notTezTokenSymbol);

        await confirmOperation(initializeLiquidityTezOperation.opHash, {
          message: initializeLiquidityMessage
        });
        amplitudeService.logEvent('LIQUIDITY_INIT_SUCCESS', logData);
      } catch (error) {
        amplitudeService.logEvent('LIQUIDITY_INIT_FAILED', { ...logData, error });
      }
    }

    setLastEditedInput(null);
    setTokenAInput('');
    setTokenBInput('');
    await Promise.all([updateTokenABalance(tokenA), updateTokenBBalance(tokenB)]);
  };

  const [isLiquidityLoading, handleAddLiquidity] = useLoadingDecorator(async () => {
    if (isExist(dex) && dex.contract.address === TOKEN_TO_TOKEN_DEX) {
      await investTokenToToken();

      return;
    }

    await investTezosToToken();
  });

  return {
    validationMessageTokenA,
    validationMessageTokenB,
    accountPkh,
    tokenABalance,
    tokenBBalance,
    tokenAInput,
    tokenBInput,
    isPoolNotExist,
    isSubmiting: isLiquidityLoading,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  };
};
