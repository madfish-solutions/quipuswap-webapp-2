import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useTokens } from '@utils/dapp';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { useDexContract } from '../hooks';
import { findToken, getLiquidityUrl, parseUrl } from './helpers';
import { getTabById, LiquidityTabs } from './liquidity-tabs';

export const useLiquidityFormService = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: tokens, loading } = useTokens();

  const { tabId } = parseUrl(location.pathname);

  const [tab, setTab] = useState(getTabById(tabId as LiquidityTabs));

  const [tokenA, setTokenA] = useState<Nullable<WhitelistedToken>>(null);
  const [tokenB, setTokenB] = useState<Nullable<WhitelistedToken>>(null);

  const dex = useDexContract(tokenA, tokenB);

  // Initial set tokens
  useEffect(() => {
    if (loading) {
      return;
    }

    const { contractTokenA, idTokenA, contractTokenB, idTokenB } = parseUrl(location.pathname);

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

  const changeRoute = async (tabId: LiquidityTabs, _tokenA: WhitelistedToken, _tokenB: WhitelistedToken) => {
    const liqUrl = getLiquidityUrl(tabId || tab.id, _tokenA, _tokenB);
    navigate(liqUrl, { replace: true });
  };

  const handleChangeTab = (tabId: LiquidityTabs) => {
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
