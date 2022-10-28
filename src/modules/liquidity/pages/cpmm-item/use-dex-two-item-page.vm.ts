import { useEffect } from 'react';

import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const newLiquidityItemStore = useLiquidityItemStore();

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
