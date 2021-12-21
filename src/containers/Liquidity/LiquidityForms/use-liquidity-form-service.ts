import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDexContract } from '@containers/Liquidity/hooks/use-dex-contract';
import { findToken } from '@containers/Liquidity/LiquidityForms/helpers/find-token';
import { getLiquidityUrl } from '@containers/Liquidity/LiquidityForms/helpers/get-liquidity-url';
import { parseUrl } from '@containers/Liquidity/LiquidityForms/helpers/parse-url';
import { getTabById, LiquidityTabsEnum } from '@containers/Liquidity/LiquidityForms/liquidity-tabs';
import { useTokens } from '@utils/dapp';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export const useLiquidityFormService = () => {
  const router = useRouter();
  const { data: tokens, loading } = useTokens();

  const { tabId } = parseUrl(router.asPath);

  const [tab, setTab] = useState(getTabById(tabId as LiquidityTabsEnum));

  const [tokenA, setTokenA] = useState<WhitelistedToken | null>(null);
  const [tokenB, setTokenB] = useState<WhitelistedToken | null>(null);

  const dex = useDexContract(tokenA, tokenB);

  // Initial set tokens
  useEffect(() => {
    if (loading) {
      return;
    }

    const { contractTokenA, idTokenA, contractTokenB, idTokenB } = parseUrl(router.asPath);

    const validTokenA = findToken(contractTokenA, idTokenA, tokens);
    if (validTokenA) {
      setTokenA(validTokenA);
    }

    const validTokenB = findToken(contractTokenB, idTokenB, tokens);
    if (validTokenB) {
      setTokenB(validTokenB);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const changeRoute = async (tabId: LiquidityTabsEnum, _tokenA: WhitelistedToken, _tokenB: WhitelistedToken) => {
    const liqUrl = getLiquidityUrl(tabId || tab.id, _tokenA, _tokenB);
    await router.replace(liqUrl, undefined, { shallow: true });
  };

  const handleChangeTab = (tabId: LiquidityTabsEnum) => {
    const newTab = getTabById(tabId);

    setTab(newTab);

    if (tokenA && tokenB) {
      void changeRoute(newTab.id, tokenA, tokenB);
    }
  };

  const handleChangeTokenA = (token: WhitelistedToken) => {
    setTokenA(token);

    if (tokenB) {
      void changeRoute(tab.id, token, tokenB);
    }
  };

  const handleChangeTokenB = (token: WhitelistedToken) => {
    setTokenB(token);

    if (tokenA) {
      void changeRoute(tab.id, tokenA, token);
    }
  };

  const handleChangeTokensPair = ({ token1, token2 }: WhitelistedTokenPair) => {
    setTokenA(token1);
    setTokenB(token2);
    void changeRoute(tab.id, token1, token2);
  };

  return {
    tab,
    handleChangeTab,
    dex,
    tokenA,
    tokenB,
    handleChangeTokenA,
    handleChangeTokenB,
    handleChangeTokensPair
  };
};
