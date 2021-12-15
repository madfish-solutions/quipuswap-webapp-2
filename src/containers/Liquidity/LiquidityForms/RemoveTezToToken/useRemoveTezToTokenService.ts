import { useState, useEffect, ChangeEvent } from 'react';

import BigNumber from 'bignumber.js';

import { removeLiquidity } from '@containers/Liquidity/liquidutyHelpers';
import { useTezos, useAccountPkh } from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { slippageToBignum } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

import { useLoadDexContract, useLoadLpTokenBalance, useLoadTokenBalance } from '../hooks';

export const useRemoveTezToTokenService = (tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dex, isTezosToTokenDex } = useLoadDexContract(tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);
  const lpTokenBalance = useLoadLpTokenBalance(dex, isTezosToTokenDex, tokenA, tokenB);

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [slippage, setSlippage] = useState<BigNumber>(new BigNumber(0.005));

  useEffect(() => {
    if (!dex) return;
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    }

    const tezPerOneLp = dex.storage.storage.tez_pool.dividedBy(dex.storage.storage.total_supply);

    const quipuPerOneLp = dex.storage.storage.token_pool.dividedBy(dex.storage.storage.total_supply);

    const isTokenATez = tokenA.contractAddress === TEZOS_TOKEN.contractAddress;

    if (isTokenATez) {
      setTokenAOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
      setTokenBOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
    } else {
      setTokenAOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
      setTokenBOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
    }
  }, [lpTokenInput, dex, tokenA, tokenB]);

  const handleLpTokenChange = (event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value);

  const handleSlippageChange = (value?: string) => {
    if (!value) {
      return;
    }
    const fixedValue = slippageToBignum(value);
    setSlippage(fixedValue.gte(100) ? new BigNumber(100) : fixedValue);
  };

  const handleBalance = (value: string) => {
    const fixedValue = new BigNumber(value);
    setLpTokenInput(fixedValue.toFixed());
  };

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) return;

    await removeLiquidity(tezos, dex, new BigNumber(lpTokenInput), slippage);
    setLpTokenInput('');
  };

  return {
    accountPkh,
    tokenAOutput,
    tokenBOutput,
    lpTokenInput,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleLpTokenChange,
    handleSlippageChange,
    handleBalance,
    handleRemoveLiquidity
  };
};
