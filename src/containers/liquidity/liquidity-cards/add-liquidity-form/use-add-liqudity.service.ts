import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { FoundDex, Token as QuipuswapSdkToken } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT, NETWORK_ID, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { useDeadline, useSlippage } from '@utils/dapp/slippage-deadline';
import {
  getAddLiquidityMessage,
  getInitializeLiquidityMessage,
  getTokenInputAmountCap,
  getTokenSymbol,
  isUndefined,
  toDecimals
} from '@utils/helpers';
import { Nullable, Optional, Undefined, Token } from '@utils/types';

import { addLiquidityTez, addLiquidityTokenToToken, addPairTokenToToken, initializeLiquidityTez } from '../blockchain';
import { calculatePoolAmount, removeExtraZeros, sortTokensContracts, checkIsPoolNotExists } from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { validateDeadline, validateSlippage, validations } from '../validators';
import { LastChangedToken } from './last-changed-token.enum';
import { PairInfo } from './pair-info.interface';

const EMPTY_BALANCE_AMOUNT = 0;

export const useAddLiquidityService = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>,
  onTokenAChange: (token: Token) => void,
  onTokenBChange: (token: Token) => void
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { deadline } = useDeadline();
  const { slippage } = useSlippage();
  const { pairInfo, updatePairInfo } = usePairInfo(dex, tokenA, tokenB);
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
    tokenAInput: string,
    tokenBInput: string,
    tokenA: Token,
    tokenB: Token,
    pairInfo: Optional<PairInfo>,
    tokenABalance: Nullable<BigNumber>,
    tokenBBalance: Nullable<BigNumber>,
    setTokenAInput: Dispatch<SetStateAction<string>>,
    setTokenBInput: Dispatch<SetStateAction<string>>,
    setValidationMessageTokenA: Dispatch<SetStateAction<Undefined<string>>>,
    setValidationMessageTokenB: Dispatch<SetStateAction<Undefined<string>>>
  ) => {
    setTokenAInput(tokenAInput);

    if (tokenAInput === '') {
      setTokenBInput('');
      setValidationMessageTokenA(undefined);
      setValidationMessageTokenB(undefined);

      return;
    }
    const tokenABN = new BigNumber(tokenAInput);

    const { decimals: decimalsA, symbol: symbolA } = tokenA.metadata;
    const { decimals: decimalsB, symbol: symbolB } = tokenB.metadata;

    const maxTokenAInput =
      tokenABalance && BigNumber.maximum(tokenABalance.minus(getTokenInputAmountCap(tokenA)), EMPTY_BALANCE_AMOUNT);
    const validationA = validations(accountPkh, tokenABN, maxTokenAInput, tokenAInput, decimalsA, symbolA);
    setValidationMessageTokenA(validationA);

    if (isPoolNotExist) {
      return;
    }

    const { tokenAPool, tokenBPool, tokenA: pairTokenA } = pairInfo!;

    const isTokensOrderValid = tokenA.contractAddress === pairTokenA.contractAddress;
    const validTokenAPool = isTokensOrderValid ? tokenAPool : tokenBPool;
    const validTokenBPool = isTokensOrderValid ? tokenBPool : tokenAPool;

    const tokenBAmount = calculatePoolAmount(tokenABN, tokenA, tokenB, validTokenAPool, validTokenBPool);

    const maxTokenBInput =
      tokenBBalance && BigNumber.maximum(tokenBBalance.minus(getTokenInputAmountCap(tokenB)), EMPTY_BALANCE_AMOUNT);
    const validationB = tokenBAmount
      ? validations(accountPkh, tokenBAmount, maxTokenBInput, tokenBInput, decimalsB, symbolB)
      : undefined;

    setValidationMessageTokenB(validationB);

    setTokenBInput(tokenBAmount ? tokenBAmount.toFixed() : '');
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
      tokenA!,
      tokenB!,
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
      tokenB!,
      tokenA!,
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
    const { decimals } = tokenA!.metadata;
    const fixedValue = removeExtraZeros(value, decimals);

    setLastEditedInput(LastChangedToken.tokenA);
    tokensCalculations(
      fixedValue,
      tokenBInput,
      tokenA!,
      tokenB!,
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
    const { decimals } = tokenB!.metadata;
    const fixedValue = removeExtraZeros(value, decimals);

    setLastEditedInput(LastChangedToken.tokenB);
    tokensCalculations(
      fixedValue,
      tokenAInput,
      tokenB!,
      tokenA!,
      pairInfo,
      tokenBBalance,
      tokenABalance,
      setTokenBInput,
      setTokenAInput,
      setValidationMessageTokenB,
      setValidationMessageTokenA
    );
  };

  const investTokenToToken = async () => {
    if (!tezos || !accountPkh || !dex || !tokenA || !tokenB) {
      return;
    }

    const { isRevert } = sortTokensContracts(tokenA, tokenB);
    const pairTokenA = isRevert ? tokenB : tokenA;
    const pairTokenB = isRevert ? tokenA : tokenB;
    const pairInputA = isRevert ? tokenBInput : tokenAInput;
    const pairInputB = isRevert ? tokenAInput : tokenBInput;

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

        await confirmOperation(addPairTokenToTokenOperation.opHash, {
          message: initializeLiquidityMessage
        });
      }
    } else {
      const addLiquidityTokenToTokenOperation = await addLiquidityTokenToToken(
        tezos,
        accountPkh,
        dex,
        pairInfo!.id!,
        pairInputA,
        pairTokenA,
        pairTokenB,
        pairInfo!.totalSupply,
        pairInfo!.tokenAPool,
        pairInfo!.tokenBPool,
        deadline,
        slippage
      );

      const tokenASymbol = getTokenSymbol(pairTokenA);
      const tokenBSymbol = getTokenSymbol(pairTokenB);

      const addLiquidityMessage = getAddLiquidityMessage(tokenASymbol, tokenBSymbol);

      await confirmOperation(addLiquidityTokenToTokenOperation.opHash, {
        message: addLiquidityMessage
      });
    }

    setLastEditedInput(null);
    setTokenAInput('');
    setTokenBInput('');
    await Promise.all([updateTokenABalance(tokenA), updateTokenBBalance(tokenB), updatePairInfo(dex, tokenA, tokenB)]);
  };

  const investTezosToToken = async () => {
    if (!tezos || !accountPkh || !dex || !tokenA || !tokenB) {
      return;
    }

    const notTezToken = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenB : tokenA;
    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;
    const notTezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBInput : tokenAInput;
    const tezTokenBN = new BigNumber(tezTokenInput);
    const tezValue = toDecimals(tezTokenBN, TEZOS_TOKEN);

    const shouldAddLiquidity =
      pairInfo && pairInfo.tokenAPool.gt(EMPTY_POOL_AMOUNT) && pairInfo.tokenBPool.gt(EMPTY_POOL_AMOUNT);

    if (shouldAddLiquidity) {
      const addLiquidityTezOperation = await addLiquidityTez(tezos, dex, tezValue);

      const notTezTokenSymbol = getTokenSymbol(notTezToken);

      const addLiquidityMessage = getAddLiquidityMessage(TEZOS_TOKEN.metadata.symbol, notTezTokenSymbol);

      await confirmOperation(addLiquidityTezOperation.opHash, {
        message: addLiquidityMessage
      });
    } else {
      const token: QuipuswapSdkToken = {
        contract: notTezToken.contractAddress,
        id: notTezToken.fa2TokenId
      };
      const notTezTokenBN = new BigNumber(notTezTokenInput);
      const tokenBValue = toDecimals(notTezTokenBN, notTezToken);

      const initializeLiquidityTezOperation = await initializeLiquidityTez(
        tezos,
        NETWORK_ID,
        token,
        tokenBValue,
        tezValue
      );

      const notTezTokenSymbol = getTokenSymbol(notTezToken);

      const initializeLiquidityMessage = getInitializeLiquidityMessage(TEZOS_TOKEN.metadata.symbol, notTezTokenSymbol);

      await confirmOperation(initializeLiquidityTezOperation.opHash, {
        message: initializeLiquidityMessage
      });
    }

    setLastEditedInput(null);
    setTokenAInput('');
    setTokenBInput('');
    await Promise.all([updateTokenABalance(tokenA), updateTokenBBalance(tokenB)]);
  };

  const handleAddLiquidity = async () => {
    if (dex!.contract.address === TOKEN_TO_TOKEN_DEX) {
      return await investTokenToToken();
    }

    return await investTezosToToken();
  };

  const validationMessageDeadline = validateDeadline(deadline);
  const validationMessageSlippage = validateSlippage(slippage);

  return {
    validationMessageTokenA,
    validationMessageTokenB,
    validationMessageDeadline,
    validationMessageSlippage,
    accountPkh,
    tokenABalance,
    tokenBBalance,
    tokenAInput,
    tokenBInput,
    isPoolNotExist,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  };
};
