import { ChangeEvent, useEffect, useState } from 'react';

import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { EMPTY_POOL_AMOUNT, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { fromDecimals, toDecimals } from '@utils/helpers';
import { Nullable, Undefined, WhitelistedToken } from '@utils/types';

import {
  addLiquidityTez,
  addLiquidityTokenToToken,
  addPairTokenToToken,
  calculateTokenAmount,
  initializeLiquidityTez,
  sortTokensContracts
} from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { validateUserInputAmount, validateUserInput } from '../validators';
import { LastChangedTokenEnum } from './last-changed-token.enum';

export const useAddLiquidityService = (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  onTokenAChange: (token: WhitelistedToken) => void,
  onTokenBChange: (token: WhitelistedToken) => void
) => {
  const tezos = useTezos();
  const networkId = useNetwork().id;
  const accountPkh = useAccountPkh();
  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);

  const [tokenAInput, setTokenAInput] = useState('');
  const [tokenBInput, setTokenBInput] = useState('');
  const [validationMessageTokenA, setValidationMessageTokenA] = useState<Undefined<string>>();
  const [validationMessageTokenB, setValidationMessageTokenB] = useState<Undefined<string>>();
  const [changedToken, setChangedToken] = useState<Nullable<'tokenA' | 'tokenB'>>(null);

  useEffect(() => {
    if (
      !changedToken ||
      !pairInfo ||
      pairInfo.tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.totalSupply.eq(EMPTY_POOL_AMOUNT)
    ) {
      return;
    }

    if (changedToken === LastChangedTokenEnum.tokenA) {
      if (tokenAInput === '') {
        setTokenBInput('');

        return;
      }

      const { totalSupply, tokenAPool, tokenBPool, tokenA: pairTokenA } = pairInfo;
      const { decimals: decimalsA } = tokenA.metadata;
      const { decimals: decimalsB } = tokenB.metadata;

      const tokenABN = new BigNumber(tokenAInput);
      const tokenAAmount = toDecimals(tokenABN, decimalsA);

      const tokenBAmount =
        tokenA.contractAddress === pairTokenA.contractAddress
          ? calculateTokenAmount(tokenAAmount, totalSupply, tokenAPool, tokenBPool)
          : calculateTokenAmount(tokenAAmount, totalSupply, tokenBPool, tokenAPool);

      setTokenBInput(fromDecimals(tokenBAmount, decimalsB).toFixed());
    } else {
      if (tokenBInput === '') {
        setTokenAInput('');

        return;
      }

      const { totalSupply, tokenAPool, tokenBPool, tokenB: pairTokenB } = pairInfo;
      const { decimals: decimalsA } = tokenA.metadata;
      const { decimals: decimalsB } = tokenB.metadata;

      const tokenBBN = new BigNumber(tokenBInput);
      const tokenBAmount = toDecimals(tokenBBN, decimalsB);

      const tokenAAmount =
        tokenB.contractAddress === pairTokenB.contractAddress
          ? calculateTokenAmount(tokenBAmount, totalSupply, tokenBPool, tokenAPool)
          : calculateTokenAmount(tokenBAmount, totalSupply, tokenAPool, tokenBPool);

      setTokenAInput(fromDecimals(tokenAAmount, decimalsA).toFixed());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo]);

  const handleSetTokenA = (token: WhitelistedToken) => {
    onTokenAChange(token);
    setChangedToken(LastChangedTokenEnum.tokenA);
    setTokenAInput('');
  };

  const handleSetTokenB = (token: WhitelistedToken) => {
    onTokenBChange(token);
    setChangedToken(LastChangedTokenEnum.tokenB);
    setTokenBInput('');
  };

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');
      setValidationMessageTokenA(undefined);

      return;
    }

    const validatedInput = validateUserInput(event.target.value);
    const validatedInputAmount = validateUserInputAmount(
      toDecimals(new BigNumber(event.target.value), tokenA),
      tokenABalance
    );

    if (validatedInput) {
      setValidationMessageTokenA(validatedInput);
      setTokenBInput('');

      return;
    } else if (validatedInputAmount) {
      setValidationMessageTokenA(validatedInputAmount);
      setTokenBInput('');

      return;
    }

    if (
      !pairInfo ||
      pairInfo.tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.totalSupply.eq(EMPTY_POOL_AMOUNT)
    ) {
      return;
    }

    const { totalSupply, tokenAPool, tokenBPool, tokenA: pairTokenA } = pairInfo;
    const { decimals: decimalsA } = tokenA.metadata;
    const { decimals: decimalsB } = tokenB.metadata;

    const tokenABN = new BigNumber(event.target.value);
    const tokenAAmount = toDecimals(tokenABN, decimalsA);

    const tokenBAmount =
      tokenA.contractAddress === pairTokenA.contractAddress
        ? calculateTokenAmount(tokenAAmount, totalSupply, tokenAPool, tokenBPool)
        : calculateTokenAmount(tokenAAmount, totalSupply, tokenBPool, tokenAPool);

    setTokenBInput(fromDecimals(tokenBAmount, decimalsB).toFixed());
    setValidationMessageTokenA(undefined);
  };

  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');
      setValidationMessageTokenB(undefined);

      return;
    }

    const validatedInput = validateUserInput(event.target.value);
    const validatedInputAmount = validateUserInputAmount(
      toDecimals(new BigNumber(event.target.value), tokenB),
      tokenBBalance
    );

    if (validatedInput) {
      setValidationMessageTokenB(validatedInput);
      setTokenAInput('');

      return;
    } else if (validatedInputAmount) {
      setValidationMessageTokenB(validatedInputAmount);
      setTokenAInput('');

      return;
    }

    if (
      !pairInfo ||
      pairInfo.tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.totalSupply.eq(EMPTY_POOL_AMOUNT)
    ) {
      return;
    }

    const { totalSupply, tokenAPool, tokenBPool, tokenB: pairTokenB } = pairInfo;
    const { decimals: decimalsA } = tokenA.metadata;
    const { decimals: decimalsB } = tokenB.metadata;

    const tokenBBN = new BigNumber(event.target.value);
    const tokenBAmount = toDecimals(tokenBBN, decimalsB);

    const tokenAAmount =
      tokenB.contractAddress === pairTokenB.contractAddress
        ? calculateTokenAmount(tokenBAmount, totalSupply, tokenBPool, tokenAPool)
        : calculateTokenAmount(tokenBAmount, totalSupply, tokenAPool, tokenBPool);

    setTokenAInput(fromDecimals(tokenAAmount, decimalsA).toFixed());
    setValidationMessageTokenB(undefined);
  };

  const handleTokenABalance = (value: string) => {
    const tokenABN = new BigNumber(value);
    const { decimals: decimalsA } = tokenA.metadata;

    setTokenAInput(value);

    if (!pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply, tokenA: pairTokenA } = pairInfo;
    const { decimals: decimalsB } = tokenB.metadata;

    const tokenAAmount = toDecimals(tokenABN, decimalsA);

    const tokenBAmount =
      tokenA.contractAddress === pairTokenA.contractAddress
        ? calculateTokenAmount(tokenAAmount, totalSupply, tokenAPool, tokenBPool)
        : calculateTokenAmount(tokenAAmount, totalSupply, tokenBPool, tokenAPool);

    setTokenBInput(fromDecimals(tokenBAmount, decimalsB).toFixed());
  };

  const handleTokenBBalance = (value: string) => {
    const tokenBBN = new BigNumber(value);
    const { decimals: decimalsB } = tokenB.metadata;

    setTokenBInput(value);

    if (!pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply, tokenB: pairTokenB } = pairInfo;
    const { decimals: decimalsA } = tokenA.metadata;

    const tokenBAmount = toDecimals(tokenBBN, decimalsB);

    const tokenAAmount =
      tokenB.contractAddress === pairTokenB.contractAddress
        ? calculateTokenAmount(tokenBAmount, totalSupply, tokenBPool, tokenAPool)
        : calculateTokenAmount(tokenBAmount, totalSupply, tokenAPool, tokenBPool);

    setTokenAInput(fromDecimals(tokenAAmount, decimalsA).toFixed());
  };

  const investTokenToToken = async () => {
    if (!tezos || !accountPkh) {
      return;
    }

    const { addressA, addressB } = sortTokensContracts(tokenA, tokenB);
    const pairTokenA = addressA === tokenA.contractAddress ? tokenA : tokenB;
    const pairTokenB = addressB === tokenB.contractAddress ? tokenB : tokenA;
    const pairInputA = addressA === tokenA.contractAddress ? tokenAInput : tokenBInput;
    const pairInputB = addressB === tokenB.contractAddress ? tokenBInput : tokenAInput;

    if (!pairInfo) {
      return await addPairTokenToToken(tezos, dex, accountPkh, pairTokenA, pairTokenB, pairInputA, pairInputB);
    }

    return await addLiquidityTokenToToken(
      tezos,
      accountPkh,
      dex,
      pairInfo.id!,
      pairInputA,
      pairTokenA,
      pairTokenB,
      pairInfo.totalSupply,
      pairInfo.tokenAPool,
      pairInfo.tokenBPool
    );
  };

  const investTezosToToken = async () => {
    if (!tezos || !accountPkh) {
      return;
    }

    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;
    const tezTokenBN = new BigNumber(tezTokenInput);
    const tezValue = toDecimals(tezTokenBN, TEZOS_TOKEN);

    const shouldAddLiquidity =
      pairInfo && pairInfo.tokenAPool.gt(EMPTY_POOL_AMOUNT) && pairInfo.tokenBPool.gt(EMPTY_POOL_AMOUNT);

    if (shouldAddLiquidity) {
      await addLiquidityTez(tezos, dex, tezValue);

      return;
    }

    const notTezToken = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenB : tokenA;
    const notTezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBInput : tokenAInput;

    const token: Token = {
      contract: notTezToken.contractAddress,
      id: notTezToken.fa2TokenId
    };
    const notTezTokenBN = new BigNumber(notTezTokenInput);
    const tokenBValue = toDecimals(notTezTokenBN, notTezToken);
    await initializeLiquidityTez(tezos, networkId, token, tokenBValue, tezValue);
  };

  const handleAddLiquidity = async () => {
    if (dex.contract.address === TOKEN_TO_TOKEN_DEX) {
      await investTokenToToken();
    }

    await investTezosToToken();
  };

  return {
    validationMessageTokenA,
    validationMessageTokenB,
    accountPkh,
    tokenABalance,
    tokenBBalance,
    tokenAInput,
    tokenBInput,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  };
};
