import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDexContract } from '@containers/Liquidity/hooks/use-dex-contract';
import { isTezInPair } from '@containers/Liquidity/LiquidityForms/helpers';
import { findToken } from '@containers/Liquidity/LiquidityForms/helpers/find-token';
import { getLiquidityUrl } from '@containers/Liquidity/LiquidityForms/helpers/get-liquidity-url';
import { parseUrl } from '@containers/Liquidity/LiquidityForms/helpers/parse-url';
import { useLoadLpTokenBalance, useLoadTokenBalance } from '@containers/Liquidity/LiquidityForms/hooks';
import { getTabById, LiquidityTabsEnum } from '@containers/Liquidity/LiquidityForms/liquidity-tabs';
import { useTokens } from '@utils/dapp';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export const useLiquidityFormContent = () => {
  const router = useRouter();
  const { data: tokens } = useTokens();

  const { tabId } = parseUrl(router.asPath);

  const [tab, setTab] = useState(getTabById(tabId as LiquidityTabsEnum));

  const [tokenA, setTokenA] = useState<WhitelistedToken | null>(null);
  const [tokenB, setTokenB] = useState<WhitelistedToken | null>(null);

  const dexContract = useDexContract(tokenA, tokenB);

  const lpTokenBalance = useLoadLpTokenBalance(dexContract, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);

  // Initial set tokens
  useEffect(() => {
    const { contractTokenA, idTokenA, contractTokenB, idTokenB } = parseUrl(router.asPath);

    const validTokenA = findToken(contractTokenA, idTokenA, tokens);
    if (validTokenA) {
      setTokenA(validTokenA);
    }

    const validTokenB = findToken(contractTokenB, idTokenB, tokens);
    if (validTokenB) {
      setTokenB(validTokenB);
    }
  }, [router.asPath, tokens]);

  const changeRoute = async (tabId?: LiquidityTabsEnum) => {
    await router.replace(getLiquidityUrl(tabId || tab.id, tokenA, tokenB), undefined, { shallow: true });
  };

  const handleChangeTab = (tabId: LiquidityTabsEnum) => {
    setTab(getTabById(tabId));
    void changeRoute(tabId);
  };

  const handleChangeTokenA = (token: WhitelistedToken) => {
    setTokenA(token);
    void changeRoute();
  };

  const handleChangeTokenB = (token: WhitelistedToken) => {
    setTokenB(token);
    void changeRoute();
  };

  const handleChangeTokensPair = ({ token1, token2 }: WhitelistedTokenPair) => {
    setTokenA(token1);
    setTokenB(token2);
    void changeRoute();
  };

  return {
    tab,
    handleChangeTab,
    dexInfo: {
      dex: dexContract,
      isTezosToTokenDex: tokenA && tokenB && isTezInPair(tokenA.contractAddress, tokenB.contractAddress)
    },
    tokenA,
    tokenB,
    handleChangeTokenA,
    handleChangeTokenB,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleChangeTokensPair
  };
};
