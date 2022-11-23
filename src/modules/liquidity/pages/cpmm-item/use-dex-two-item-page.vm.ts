import { useEffect } from 'react';

import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, useRedirectToNotFoundDigitsRoute } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug, pairSlugIsValid } = useCpmmPairSlug();
  const liquidityItemStore = useLiquidityItemStore();
  const redirectToNotFoundPage = useRedirectToNotFoundDigitsRoute();
  const { liquidityListStore } = useRootStore();
  const invalidPairSlugExists = isExist(pairSlug) && !pairSlugIsValid && pairSlug !== NOT_FOUND_ROUTE_NAME;

  useEffect(() => {
    if (pairSlugIsValid) {
      (async () => {
        liquidityItemStore.setTokenPairSlug(pairSlug);
        await liquidityListStore?.listStore.load();
        await liquidityItemStore.itemSore.load();
      })();
    }

    return () => liquidityItemStore.itemSore.resetData();
  }, [liquidityItemStore, liquidityListStore?.listStore, pairSlug, pairSlugIsValid]);

  useEffect(() => {
    if (invalidPairSlugExists || liquidityItemStore.itemApiError) {
      redirectToNotFoundPage();
    }
  }, [invalidPairSlugExists, liquidityItemStore.itemApiError, redirectToNotFoundPage]);

  return {
    t,
    title: liquidityItemStore.pageTitle,
    isInitialized: pairSlugIsValid ? Boolean(liquidityItemStore.item) : true
  };
};
