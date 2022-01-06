import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

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
import { validations } from '../validators';
import { LastChangedToken } from './last-changed-token.enum';
import { PairInfo } from './pair-info.interface';

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
  const [changedToken, setChangedToken] = useState<Nullable<LastChangedToken>>(null);

  const tokensCalculations = (
    tokenA: WhitelistedToken,
    tokenAInput: string,
    tokenB: WhitelistedToken,
    pairInfo: Nullable<PairInfo>,
    tokenABalance: Nullable<BigNumber>,
    tokenBBalance: Nullable<BigNumber>,
    setTokenAInput: Dispatch<SetStateAction<string>>,
    setTokenBInput: Dispatch<SetStateAction<string>>,
    setValidationMessageTokenA: Dispatch<SetStateAction<Undefined<string>>>,
    setValidationMessageTokenB: Dispatch<SetStateAction<Undefined<string>>>
  ) => {
    if (tokenAInput === '') {
      setTokenBInput('');
      setValidationMessageTokenA(undefined);
      setValidationMessageTokenB(undefined);

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

    const { tokenAPool, tokenBPool, totalSupply, tokenA: pairTokenA } = pairInfo;

    const tokenABN = new BigNumber(tokenAInput);
    const tokenAAmount = toDecimals(tokenABN, tokenA);

    const validationA = validations(tokenAAmount, tokenABalance);
    setValidationMessageTokenA(validationA);

    if (validationA === 'Invalid input') {
      setTokenBInput('');

      return;
    }

    const isTokensOrderValid = tokenA.contractAddress === pairTokenA.contractAddress;
    const validTokenAPool = isTokensOrderValid ? tokenAPool : tokenBPool;
    const validTokenBPool = isTokensOrderValid ? tokenBPool : tokenAPool;

    const tokenBAmount = calculateTokenAmount(tokenAAmount, totalSupply, validTokenAPool, validTokenBPool);

    const validationB = validations(tokenBAmount, tokenBBalance);
    setValidationMessageTokenB(validationB);

    setTokenBInput(fromDecimals(tokenBAmount, tokenB).toFixed());
  };

  useEffect(() => {
    if (!changedToken) {
      return;
    }

    if (changedToken === LastChangedToken.tokenB) {
      tokensCalculations(
        tokenA,
        tokenAInput,
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
        tokenB,
        tokenBInput,
        tokenA,
        pairInfo,
        tokenABalance,
        tokenBBalance,
        setTokenBInput,
        setTokenAInput,
        setValidationMessageTokenB,
        setValidationMessageTokenA
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo]);

  const handleSetTokenA = (token: WhitelistedToken) => {
    onTokenAChange(token);
    setChangedToken(LastChangedToken.tokenA);
    setTokenAInput('');
  };

  const handleSetTokenB = (token: WhitelistedToken) => {
    onTokenBChange(token);
    setChangedToken(LastChangedToken.tokenB);
    setTokenBInput('');
  };

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    tokensCalculations(
      tokenA,
      event.target.value,
      tokenB,
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
    setTokenBInput(event.target.value);

    tokensCalculations(
      tokenB,
      event.target.value,
      tokenA,
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

    const { id, tokenAPool, tokenBPool, totalSupply } = pairInfo;

    if (
      !id ||
      tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      totalSupply.eq(EMPTY_POOL_AMOUNT)
    ) {
      return await addPairTokenToToken(tezos, dex, accountPkh, pairTokenA, pairTokenB, pairInputA, pairInputB);
    }

    return await addLiquidityTokenToToken(
      tezos,
      accountPkh,
      dex,
      id,
      pairInputA,
      pairTokenA,
      pairTokenB,
      totalSupply,
      tokenAPool,
      tokenBPool
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
      return await investTokenToToken();
    }

    return await investTezosToToken();
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
