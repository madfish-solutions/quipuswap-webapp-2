import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { Nullable, RawToken, TokenPair } from '@interfaces/types';
import { useSearchCustomTokens, useTokens } from '@utils/dapp';

import { useDexContract } from '../hooks';
import { findToken, getLiquidityUrl, parseUrl } from './helpers';
import { getTabById, LiquidityTabs } from './liquidity-tabs';

const handleSearchPromise = async (
  searchPromise: Promise<Nullable<RawToken>>,
  setToken: Dispatch<SetStateAction<Nullable<RawToken>>>,
  tokenDirtyRef: MutableRefObject<boolean>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const token = await searchPromise;
    if (token && !tokenDirtyRef.current) {
      setToken(token);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error while getting token metadata', e);
  } finally {
    setLoading(false);
  }
};

export const useLiquidityFormService = ({
  onTokensChange
}: {
  onTokensChange: (token1: Nullable<RawToken>, token2: Nullable<RawToken>) => void;
}) => {
  const router = useRouter();
  const { data: tokens, loading } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();

  const url = router.asPath;
  const { tabId } = parseUrl(url);

  const [tab, setTab] = useState(getTabById(tabId as LiquidityTabs));
  const [tokenA, setTokenA] = useState<Nullable<RawToken>>(null);
  const [tokenB, setTokenB] = useState<Nullable<RawToken>>(null);
  const [tokenALoading, setTokenALoading] = useState(false);
  const [tokenBLoading, setTokenBLoading] = useState(false);
  const tokenADirtyRef = useRef(false);
  const tokenBDirtyRef = useRef(false);

  const handleUpdateTitle = (token1: Nullable<RawToken>, token2: Nullable<RawToken>) => {
    onTokensChange(token1, token2);
  };

  const { dex, clearDex } = useDexContract(tokenA, tokenB);

  // Initial set tokens
  useEffect(() => {
    if (loading) {
      return;
    }

    const { contractTokenA, idTokenA, contractTokenB, idTokenB } = parseUrl(url);

    const validTokenA = findToken(contractTokenA, idTokenA, tokens);
    if (validTokenA) {
      setTokenA(validTokenA);
    } else {
      handleSearchPromise(
        searchCustomTokens(contractTokenA, Number(idTokenA), true),
        setTokenA,
        tokenADirtyRef,
        setTokenALoading
      );
    }

    const validTokenB = findToken(contractTokenB, idTokenB, tokens);
    if (validTokenB) {
      setTokenB(validTokenB);
    } else {
      handleSearchPromise(
        searchCustomTokens(contractTokenB, Number(idTokenB), true),
        setTokenB,
        tokenBDirtyRef,
        setTokenBLoading
      );
    }
    handleUpdateTitle(validTokenA, validTokenB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, url, tokens, searchCustomTokens]);

  const changeRoute = async (tabId: LiquidityTabs, _tokenA: RawToken, _tokenB: RawToken) => {
    const liqUrl = getLiquidityUrl(tabId || tab.id, _tokenA, _tokenB);
    await router.replace(liqUrl, undefined, { shallow: true, scroll: false });
  };

  const handleChangeTab = (tabId: LiquidityTabs) => {
    const newTab = getTabById(tabId);

    setTab(newTab);

    if (tokenA && tokenB) {
      void changeRoute(newTab.id, tokenA, tokenB);
    }
  };

  const handleChangeTokenA = (token: RawToken) => {
    setTokenA(token);
    tokenADirtyRef.current = true;
    clearDex();
    handleUpdateTitle(token, tokenB);

    if (tokenB) {
      void (tab.id, token, tokenB);
    }
  };
  const handleChangeTokenB = (token: RawToken) => {
    setTokenB(token);
    tokenBDirtyRef.current = true;
    clearDex();
    handleUpdateTitle(tokenA, token);

    if (tokenA) {
      void changeRoute(tab.id, tokenA, token);
    }
  };

  const handleChangeTokensPair = ({ token1, token2 }: TokenPair) => {
    setTokenA(token1);
    setTokenB(token2);
    tokenADirtyRef.current = true;
    tokenBDirtyRef.current = true;
    clearDex();
    handleUpdateTitle(token1, token2);
    void changeRoute(tab.id, token1, token2);
  };

  return {
    tab,
    handleChangeTab,
    dex,
    tokenA,
    tokenB,
    tokenALoading,
    tokenBLoading,
    handleChangeTokenA,
    handleChangeTokenB,
    handleChangeTokensPair
  };
};
