import { useCallback, useEffect, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';

import { DEFAULT_DEADLINE_MINS, networksDefaultTokens, TEZOS_TOKEN } from '@app.config';
import { useNetwork, useTokens } from '@utils/dapp';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { useDexContract } from '../hooks';
import { findToken, getLiquidityUrl, parseUrl } from './helpers';
import { getTabById, LiquidityTabs } from './liquidity-tabs';

export const useLiquidityFormService = () => {
  const router = useRouter();
  const { data: tokens, loading } = useTokens();
  const { id: networkId } = useNetwork();
  const prevNetworkIdRef = useRef(networkId);

  const { tabId } = parseUrl(router.asPath);

  const [tab, setTab] = useState(getTabById(tabId as LiquidityTabs));
  const [tokenA, setTokenA] = useState<Nullable<WhitelistedToken>>(null);
  const [tokenB, setTokenB] = useState<Nullable<WhitelistedToken>>(null);
  const [transactionDuration, setTransactionDuration] = useState<BigNumber>(new BigNumber(DEFAULT_DEADLINE_MINS));

  const { dex, clearDex } = useDexContract(tokenA, tokenB);

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

  const changeRoute = useCallback(
    async (tabId: LiquidityTabs, _tokenA: WhitelistedToken, _tokenB: WhitelistedToken) => {
      const liqUrl = getLiquidityUrl(tabId || tab.id, _tokenA, _tokenB);
      await router.replace(liqUrl, undefined, { shallow: true });
    },
    [router, tab.id]
  );

  const handleChangeTab = (tabId: LiquidityTabs) => {
    const newTab = getTabById(tabId);

    setTab(newTab);

    if (tokenA && tokenB) {
      void changeRoute(newTab.id, tokenA, tokenB);
    }
  };

  const handleChangeTokenA = (token: WhitelistedToken) => {
    setTokenA(token);
    clearDex();

    if (tokenB) {
      void changeRoute(tab.id, token, tokenB);
    }
  };
  const handleChangeTokenB = (token: WhitelistedToken) => {
    setTokenB(token);
    clearDex();

    if (tokenA) {
      void changeRoute(tab.id, tokenA, token);
    }
  };

  const handleChangeTokensPair = useCallback(
    ({ token1, token2 }: WhitelistedTokenPair) => {
      setTokenA(token1);
      setTokenB(token2);
      clearDex();
      void changeRoute(tab.id, token1, token2);
    },
    [changeRoute, clearDex, tab.id]
  );

  useEffect(() => {
    if (prevNetworkIdRef.current !== networkId) {
      handleChangeTokensPair({ token1: TEZOS_TOKEN, token2: networksDefaultTokens[networkId] });
    }
    prevNetworkIdRef.current = networkId;
  }, [networkId, handleChangeTokensPair]);

  return {
    tab,
    handleChangeTab,
    dex,
    tokenA,
    tokenB,
    handleChangeTokenA,
    handleChangeTokenB,
    handleChangeTokensPair,
    transactionDuration,
    setTransactionDuration
  };
};
