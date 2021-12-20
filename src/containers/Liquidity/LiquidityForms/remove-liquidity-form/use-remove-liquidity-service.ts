import { ChangeEvent, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { useDexContract } from '@containers/Liquidity/hooks/use-dex-contract';
import { removeLiquidityTez, sortTokensContracts } from '@containers/Liquidity/LiquidityForms/helpers';
import { useLoadLpTokenBalance, useLoadTokenBalance } from '@containers/Liquidity/LiquidityForms/hooks';
import { usePairInfo } from '@containers/Liquidity/LiquidityForms/hooks/use-pair-info';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { LP_TOKEN_DECIMALS, TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export const useRemoveLiquidityService = (
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const dex = useDexContract(tokenA, tokenB);
  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);
  const lpTokenBalance = useLoadLpTokenBalance(dex, tokenA, tokenB);

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [slippage] = useState<BigNumber>(new BigNumber(0.005));
  const [tokenPair, setTokenPair] = useState<Nullable<WhitelistedTokenPair>>(null);

  useEffect(() => {
    if (!dex) {
      return;
    }
    setTokenPair({
      token1: tokenA,
      token2: tokenB,
      dex
    });
  }, [dex, tokenA, tokenB]);

  const handleSetTokenPair = (tokensPair: WhitelistedTokenPair) => {
    onChangeTokensPair(tokensPair);
  };

  useEffect(() => {
    if (!dex || !pairInfo || !tokenA || !tokenB) {
      return;
    }

    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    }
    const ten = 10;
    const lpTokenDecimals = new BigNumber(ten).pow(LP_TOKEN_DECIMALS);
    const lpTokenInputWithDecimals = new BigNumber(lpTokenInput).multipliedBy(lpTokenDecimals);

    const { decimals: decimalsA } = tokenA.metadata;
    const { decimals: decimalsB } = tokenB.metadata;
    const { tokenAPool, tokenBPool, totalSupply, tokenA: pairTokenA } = pairInfo;

    const tokenAPerOneLp = tokenAPool.dividedBy(totalSupply);
    const tokenBPerOneLp = tokenBPool.dividedBy(totalSupply);

    const amountTokenA = tokenAPerOneLp.multipliedBy(lpTokenInputWithDecimals);
    const amountTokenB = tokenBPerOneLp.multipliedBy(lpTokenInputWithDecimals);

    if (tokenA.contractAddress === pairTokenA.contractAddress) {
      setTokenAOutput(fromDecimals(amountTokenA, decimalsA).toFixed(decimalsA));
      setTokenBOutput(fromDecimals(amountTokenB, decimalsB).toFixed(decimalsB));
    } else {
      setTokenAOutput(fromDecimals(amountTokenB, decimalsB).toFixed(decimalsB));
      setTokenBOutput(fromDecimals(amountTokenA, decimalsA).toFixed(decimalsA));
    }
  }, [lpTokenInput, dex, tokenA, tokenB, pairInfo]);

  const handleBalance = (value: string) => {
    const fixedValue = new BigNumber(value);
    setLpTokenInput(fixedValue.toFixed(LP_TOKEN_DECIMALS));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value);

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex || !pairInfo) {
      return;
    }

    const { id } = pairInfo;
    const ten = new BigNumber(10);
    const shares = new BigNumber(lpTokenInput).multipliedBy(ten.pow(LP_TOKEN_DECIMALS));

    if (dex.contract.address === TOKEN_TO_TOKEN_DEX) {
      const tokenAOut = new BigNumber(tokenAOutput).multipliedBy(ten.pow(tokenA.metadata.decimals));
      const tokenBOut = new BigNumber(tokenBOutput).multipliedBy(ten.pow(tokenB.metadata.decimals));

      const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
      const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) {
        return;
      }
      if (addresses.addressA === tokenA.contractAddress) {
        await dex.contract.methods.divest(id, tokenAOut, tokenBOut, shares, timestamp.toString()).send();
      } else {
        await dex.contract.methods.divest(id, tokenBOut, tokenAOut, shares, timestamp.toString()).send();
      }
    } else {
      await removeLiquidityTez(tezos, dex, shares, slippage);
    }
  };

  return {
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleChange,
    handleBalance,
    handleSetTokenPair,
    handleRemoveLiquidity
  };
};
