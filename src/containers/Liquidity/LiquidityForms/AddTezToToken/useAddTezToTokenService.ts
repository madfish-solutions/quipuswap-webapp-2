import { Dispatch, SetStateAction, ChangeEvent, useState, useEffect } from 'react';

import { Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { addLiquidity, calculateTokenAmount, initializeLiquidity } from '@containers/Liquidity/liquidutyHelpers';
import { useTezos, useAccountPkh, useNetwork } from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { useLoadDexContract, useLoadTokenBalance } from '../hooks';

export const useAddTezToTokenService = (
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  setTokenA: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>,
  setTokenB: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>
) => {
  const tezos = useTezos();
  const networkId = useNetwork().id;
  const accountPkh = useAccountPkh();
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);
  const { dex } = useLoadDexContract(tokenA, tokenB);

  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');

  useEffect(() => {
    if (!dex) return;

    if (tokenBInput === '') {
      setTokenAInput('');
    } else {
      const { total_supply, tez_pool, token_pool } = dex.storage.storage;

      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenBAmountWithDecimals = new BigNumber(tokenBInput).multipliedBy(decimalsB);
      const calculatedTokenAInput =
        tokenB.contractAddress === TEZOS_TOKEN.contractAddress
          ? calculateTokenAmount(tokenBAmountWithDecimals, total_supply, tez_pool, token_pool)
          : calculateTokenAmount(tokenBAmountWithDecimals, total_supply, token_pool, tez_pool);

      setTokenAInput(fromDecimals(calculatedTokenAInput, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenABalance]);
  useEffect(() => {
    if (!dex) return;
    const { total_supply, tez_pool, token_pool } = dex.storage.storage;
    if (total_supply.eq(0) || tez_pool.eq(0) || token_pool.eq(0)) return;
    if (tokenAInput === '') {
      setTokenBInput('');
    } else {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = new BigNumber(tokenAInput).multipliedBy(decimalsA);
      const calculatedTokenBInput =
        tokenA.contractAddress === TEZOS_TOKEN.contractAddress
          ? calculateTokenAmount(tokenAAmountWithDecimals, total_supply, tez_pool, token_pool)
          : calculateTokenAmount(tokenAAmountWithDecimals, total_supply, token_pool, tez_pool);

      setTokenBInput(fromDecimals(calculatedTokenBInput, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenBBalance]);

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');

      return;
    }

    if (!dex || dex.storage.storage.tez_pool.eq(0) || dex.storage.storage.token_pool.eq(0)) return;

    const tokenADecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
    const tokenAAmount = new BigNumber(event.target.value).multipliedBy(tokenADecimals);

    const tokenBAmount =
      tokenA.contractAddress === TEZOS_TOKEN.contractAddress
        ? calculateTokenAmount(
            tokenAAmount,
            dex.storage.storage.total_supply,
            dex.storage.storage.tez_pool,
            dex.storage.storage.token_pool
          )
        : calculateTokenAmount(
            tokenAAmount,
            dex.storage.storage.total_supply,
            dex.storage.storage.token_pool,
            dex.storage.storage.tez_pool
          );

    setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
  };
  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');

      return;
    }

    if (!dex || dex.storage.storage.tez_pool.eq(0) || dex.storage.storage.token_pool.eq(0)) return;

    const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
    const tokenBAmount = new BigNumber(event.target.value).multipliedBy(tokenBDecimals);

    const tokenAAmount =
      tokenB.contractAddress === TEZOS_TOKEN.contractAddress
        ? calculateTokenAmount(
            tokenBAmount,
            dex.storage.storage.total_supply,
            dex.storage.storage.tez_pool,
            dex.storage.storage.token_pool
          )
        : calculateTokenAmount(
            tokenBAmount,
            dex.storage.storage.total_supply,
            dex.storage.storage.token_pool,
            dex.storage.storage.tez_pool
          );

    setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
  };

  const handleTokenABalance = (value: string) => {
    const fixedValue = new BigNumber(value);

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));

    if (!dex) return;

    const { total_supply, tez_pool, token_pool } = dex.storage.storage;

    const tokenADecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
    const tokenAAmount = fixedValue.multipliedBy(tokenADecimals);

    const tokenBAmount =
      tokenA.contractAddress === TEZOS_TOKEN.contractAddress
        ? calculateTokenAmount(tokenAAmount, total_supply, tez_pool, token_pool)
        : calculateTokenAmount(tokenAAmount, total_supply, token_pool, tez_pool);

    setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
  };
  const handleTokenBBalance = (value: string) => {
    const fixedValue = new BigNumber(value);

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));

    if (!dex) return;

    const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
    const tokenBAmount = fixedValue.multipliedBy(tokenBDecimals);

    const tokenAAmount =
      tokenB.contractAddress === TEZOS_TOKEN.contractAddress
        ? calculateTokenAmount(
            tokenBAmount,
            dex.storage.storage.total_supply,
            dex.storage.storage.tez_pool,
            dex.storage.storage.token_pool
          )
        : calculateTokenAmount(
            tokenBAmount,
            dex.storage.storage.total_supply,
            dex.storage.storage.token_pool,
            dex.storage.storage.tez_pool
          );

    setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
  };

  const handleSetTokenA = (token: WhitelistedToken) => {
    setTokenA(token);
    setTokenAInput('');
  };
  const handleSetTokenB = (token: WhitelistedToken) => {
    setTokenB(token);
    setTokenBInput('');
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh) return;

    const notTezToken = tokenA.contractAddress !== TEZOS_TOKEN.contractAddress ? tokenA : tokenB;
    const notTezTokenInput = tokenA.contractAddress !== TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;
    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;

    const tezDecimals = new BigNumber(10).pow(TEZOS_TOKEN.metadata.decimals);
    const tezValue = new BigNumber(tezTokenInput).multipliedBy(tezDecimals);

    if (dex && dex.storage.storage.token_pool.gt(0) && dex.storage.storage.tez_pool.gt(0)) {
      await addLiquidity(tezos, dex, tezValue);
    } else {
      const token: Token = {
        contract: notTezToken.contractAddress,
        id: notTezToken.fa2TokenId
      };
      const tokenBDecimals = new BigNumber(10).pow(notTezToken.metadata.decimals);
      const tokenBValue = new BigNumber(notTezTokenInput).multipliedBy(tokenBDecimals);
      await initializeLiquidity(tezos, networkId, token, tokenBValue, tezValue);
    }

    setTokenAInput('');
    setTokenBInput('');
  };

  return {
    accountPkh,
    tokenAInput,
    tokenBInput,
    tokenABalance,
    tokenBBalance,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleSetTokenA,
    handleSetTokenB,
    handleAddLiquidity
  };
};
