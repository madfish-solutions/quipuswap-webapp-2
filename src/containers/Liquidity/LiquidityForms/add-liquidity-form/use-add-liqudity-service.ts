import { ChangeEvent, useState } from 'react';

import BigNumber from 'bignumber.js';

import { useDexContract } from '@containers/Liquidity/hooks/use-dex-contract';
import { useLoadTokenBalance } from '@containers/Liquidity/LiquidityForms/hooks';
import { usePairInfo } from '@containers/Liquidity/LiquidityForms/hooks/use-pair-info';
import { calculateTokenAmount } from '@containers/Liquidity/liquidutyHelpers';
import { useAccountPkh } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

export const useAddLiqudityService = (
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  onTokenAChange: (token: WhitelistedToken) => void,
  onTokenBChange: (token: WhitelistedToken) => void
) => {
  const accountPkh = useAccountPkh();
  const dex = useDexContract(tokenA, tokenB);
  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);

  const [tokenAInput, setTokenAInput] = useState('');
  const [tokenBInput, setTokenBInput] = useState('');

  const handleSetTokenA = (token: WhitelistedToken) => {
    onTokenAChange(token);
    setTokenAInput('Loading...');
  };
  const handleSetTokenB = (token: WhitelistedToken) => {
    onTokenBChange(token);
    setTokenBInput('Loading...');
  };

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');

      return;
    }

    if (!pairInfo || pairInfo.tokenAPool.eq(0) || pairInfo.tokenBPool.eq(0) || pairInfo.totalSupply.eq(0)) {
      return;
    }

    const tokenADecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
    const tokenAAmount = new BigNumber(event.target.value).multipliedBy(tokenADecimals);

    const tokenBAmount =
      tokenA.contractAddress === pairInfo.tokenA.contractAddress
        ? calculateTokenAmount(tokenAAmount, pairInfo.totalSupply, pairInfo.tokenAPool, pairInfo.tokenBPool)
        : calculateTokenAmount(tokenAAmount, pairInfo.totalSupply, pairInfo.tokenBPool, pairInfo.tokenAPool);

    setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
  };
  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');

      return;
    }

    if (!pairInfo || pairInfo.tokenAPool.eq(0) || pairInfo.tokenBPool.eq(0) || pairInfo.totalSupply.eq(0)) {
      return;
    }

    const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
    const tokenBAmount = new BigNumber(event.target.value).multipliedBy(tokenBDecimals);

    const tokenAAmount =
      tokenB.contractAddress === pairInfo.tokenB.contractAddress
        ? calculateTokenAmount(tokenBAmount, pairInfo.totalSupply, pairInfo.tokenBPool, pairInfo.tokenAPool)
        : calculateTokenAmount(tokenBAmount, pairInfo.totalSupply, pairInfo.tokenAPool, pairInfo.tokenBPool);

    setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
  };

  const handleTokenABalance = (value: string) => {
    const fixedValue = new BigNumber(value);

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));

    if (!pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply } = pairInfo;

    const tokenADecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
    const tokenAAmount = fixedValue.multipliedBy(tokenADecimals);

    const tokenBAmount =
      tokenA.contractAddress === pairInfo.tokenA.contractAddress
        ? calculateTokenAmount(tokenAAmount, totalSupply, tokenAPool, tokenBPool)
        : calculateTokenAmount(tokenAAmount, totalSupply, tokenBPool, tokenAPool);

    setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
  };
  const handleTokenBBalance = (value: string) => {
    const fixedValue = new BigNumber(value);

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));

    if (!pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply } = pairInfo;

    const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
    const tokenBAmount = fixedValue.multipliedBy(tokenBDecimals);

    const tokenAAmount =
      tokenB.contractAddress === pairInfo.tokenB.contractAddress
        ? calculateTokenAmount(tokenBAmount, totalSupply, tokenBPool, tokenAPool)
        : calculateTokenAmount(tokenBAmount, totalSupply, tokenAPool, tokenBPool);

    setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
  };

  return {
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
    handleTokenBBalance
  };
};
