import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { LiquidityTabs } from '@modules/liquidity/liquidity-routes.enum';
import { useRootStore } from '@providers/root-store-provider';
import { getRouterParts, isExist, useRedirectToNotFoundDigitsRoute } from '@shared/helpers';
import { useTranslation } from '@translation';

const TAB_NAME_INDEX = 2;

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const liquidityItemStore = useLiquidityItemStore();
  const location = useLocation();
  const redirectToNotFoundPage = useRedirectToNotFoundDigitsRoute();
  const tabName = getRouterParts(location.pathname)[TAB_NAME_INDEX];
  const { liquidityListStore } = useRootStore();

  useEffect(() => {
    if (isExist(pairSlug)) {
      (async () => {
        liquidityItemStore.setTokenPairSlug(pairSlug);
        await liquidityListStore?.listStore.load();
        await liquidityItemStore.itemSore.load();
      })();
    }

    return () => liquidityItemStore.itemSore.resetData();
  }, [liquidityItemStore, liquidityListStore?.listStore, pairSlug]);

  useEffect(() => {
    if ((!isExist(pairSlug) || liquidityItemStore.itemApiError) && tabName !== LiquidityTabs.create) {
      redirectToNotFoundPage();
    }
  }, [pairSlug, liquidityItemStore.itemApiError, tabName, redirectToNotFoundPage]);

  return {
    t,
    title: liquidityItemStore.pageTitle,
    isInitialized: pairSlug ? Boolean(liquidityItemStore.item) : true
  };
};
