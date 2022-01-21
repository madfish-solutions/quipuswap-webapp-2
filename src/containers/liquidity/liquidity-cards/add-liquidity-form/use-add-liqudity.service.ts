import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { calculatePoolAmount } from '@containers/liquidity/liquidity-cards/helpers/calculate-pool-amount';
import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { useDeadline, useSlippage } from '@utils/dapp/slippage-deadline';
import { toDecimals } from '@utils/helpers';
import { Nullable, Undefined, WhitelistedToken } from '@utils/types';

import { addLiquidityTez, addLiquidityTokenToToken, addPairTokenToToken, initializeLiquidityTez } from '../blockchain';
import { getAddLiquidityMessage, getInitializeLiquidityMessage } from '../get-success-messages';
import { sortTokensContracts } from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { validateTransactionDuration, validations } from '../validators';
import { INVALID_INPUT } from '../validators/validate-user-input';
import { LastChangedToken } from './last-changed-token.enum';
import { PairInfo } from './pair-info.interface';

const EMPTY_POOL = 0;

export const useAddLiquidityService = (
  dex: Nullable<FoundDex>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>,
  onTokenAChange: (token: WhitelistedToken) => void,
  onTokenBChange: (token: WhitelistedToken) => void
) => {
  const tezos = useTezos();
  const networkId = useNetwork().id;
  const accountPkh = useAccountPkh();
  const { deadline } = useDeadline();
  const { slippage } = useSlippage();
  const { pairInfo, updatePairInfo } = usePairInfo(dex, tokenA, tokenB);
  const { tokenBalance: tokenABalance, updateTokenBalance: updateTokenABalance } = useLoadTokenBalance(tokenA);
  const { tokenBalance: tokenBBalance, updateTokenBalance: updateTokenBBalance } = useLoadTokenBalance(tokenB);
  const confirmOperation = useConfirmOperation();

  const [tokenAInput, setTokenAInput] = useState('');
  const [tokenBInput, setTokenBInput] = useState('');
  const [validationMessageTokenA, setValidationMessageTokenA] = useState<Undefined<string>>();
  const [validationMessageTokenB, setValidationMessageTokenB] = useState<Undefined<string>>();
  const [lastEditedInput, setLastEditedInput] = useState<Nullable<LastChangedToken>>(null);

  const tokensCalculations = (
    tokenAInput: string,
    tokenBInput: string,
    tokenA: WhitelistedToken,
    tokenB: WhitelistedToken,
    pairInfo: Nullable<PairInfo>,
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
    const tokenAAmount = toDecimals(tokenABN, tokenA);

    const { decimals: decimalsA, symbol: symbolA } = tokenA.metadata;
    const { decimals: decimalsB, symbol: symbolB } = tokenB.metadata;

    const validationA = validations(accountPkh, tokenAAmount, tokenABalance, tokenAInput, decimalsA, symbolA);
    setValidationMessageTokenA(validationA);

    if (
      !pairInfo ||
      pairInfo.tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.totalSupply.eq(EMPTY_POOL_AMOUNT)
    ) {
      return;
    }

    const { tokenAPool, tokenBPool, tokenA: pairTokenA } = pairInfo;

    if (validationA === INVALID_INPUT) {
      setTokenBInput('');

      return;
    }

    const isTokensOrderValid = tokenA.contractAddress === pairTokenA.contractAddress;
    const validTokenAPool = isTokensOrderValid ? tokenAPool : tokenBPool;
    const validTokenBPool = isTokensOrderValid ? tokenBPool : tokenAPool;

    const tokenBAmount = calculatePoolAmount(tokenABN, tokenA, tokenB, validTokenAPool, validTokenBPool);

    const validationB = tokenBAmount
      ? validations(accountPkh, tokenBAmount, tokenBBalance, tokenBInput, decimalsB, symbolB)
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

  const handleSetTokenA = (token: WhitelistedToken) => {
    onTokenAChange(token);
    if (lastEditedInput === LastChangedToken.tokenA) {
      setTokenBInput('');
    } else {
      setTokenAInput('');
    }
  };

  const handleSetTokenB = (token: WhitelistedToken) => {
    onTokenBChange(token);
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
    const fixedValue = new BigNumber(value).toFixed(decimals);

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
    const fixedValue = new BigNumber(value).toFixed(decimals);

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

    const { addressA, addressB } = sortTokensContracts(tokenA, tokenB);
    const pairTokenA = addressA === tokenA.contractAddress ? tokenA : tokenB;
    const pairTokenB = addressB === tokenB.contractAddress ? tokenB : tokenA;
    const pairInputA = addressA === tokenA.contractAddress ? tokenAInput : tokenBInput;
    const pairInputB = addressB === tokenB.contractAddress ? tokenBInput : tokenAInput;

    if (
      !pairInfo ||
      pairInfo.tokenAPool.eq(EMPTY_POOL) ||
      pairInfo.tokenBPool.eq(EMPTY_POOL) ||
      pairInfo.totalSupply.eq(EMPTY_POOL)
    ) {
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
        await confirmOperation(addPairTokenToTokenOperation.opHash, {
          message: getAddLiquidityMessage(pairTokenA.metadata.name, pairTokenA.metadata.name)
        });
      }
    } else {
      const addLiquidityTokenToTokenOperation = await addLiquidityTokenToToken(
        tezos,
        accountPkh,
        dex,
        pairInfo.id!,
        pairInputA,
        pairTokenA,
        pairTokenB,
        pairInfo.totalSupply,
        pairInfo.tokenAPool,
        pairInfo.tokenBPool,
        deadline,
        slippage
      );

      await confirmOperation(addLiquidityTokenToTokenOperation.opHash, {
        message: getAddLiquidityMessage(pairTokenA.metadata.name, pairTokenB.metadata.name)
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

      await confirmOperation(addLiquidityTezOperation.opHash, {
        message: getAddLiquidityMessage(TEZOS_TOKEN.metadata.name, notTezToken.metadata.name)
      });
    } else {
      const token: Token = {
        contract: notTezToken.contractAddress,
        id: notTezToken.fa2TokenId
      };
      const notTezTokenBN = new BigNumber(notTezTokenInput);
      const tokenBValue = toDecimals(notTezTokenBN, notTezToken);

      const initializeLiquidityTezOperation = await initializeLiquidityTez(
        tezos,
        networkId,
        token,
        tokenBValue,
        tezValue
      );

      await confirmOperation(initializeLiquidityTezOperation.opHash, {
        message: getInitializeLiquidityMessage(TEZOS_TOKEN.metadata.name, notTezToken.metadata.name)
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

  const validationMessageTransactionDuration = validateTransactionDuration(deadline);

  const isNewPair =
    !pairInfo ||
    pairInfo.tokenAPool.eq(EMPTY_POOL) ||
    pairInfo.tokenBPool.eq(EMPTY_POOL) ||
    pairInfo.totalSupply.eq(EMPTY_POOL);

  return {
    validationMessageTokenA,
    validationMessageTokenB,
    validationMessageTransactionDuration,
    accountPkh,
    tokenABalance,
    tokenBBalance,
    tokenAInput,
    tokenBInput,
    isNewPair,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  };
};
