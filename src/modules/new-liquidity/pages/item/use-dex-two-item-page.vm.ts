import { useEffect } from 'react';

import { useCpmmPairSlug, useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const newLiquidityItemStore = useNewLiquidityItemStore();

  useEffect(() => {
    newLiquidityItemStore.setTokenPairSlug(pairSlug!);
    void newLiquidityItemStore.itemSore.load();

    return () => newLiquidityItemStore.itemSore.resetData();
  }, [newLiquidityItemStore, pairSlug]);

  return {
    t,
    title: newLiquidityItemStore.pageTitle,
    isInitialized: Boolean(newLiquidityItemStore.item)
  };
};
