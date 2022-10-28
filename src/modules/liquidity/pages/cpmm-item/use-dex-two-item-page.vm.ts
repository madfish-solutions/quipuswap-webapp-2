import { useEffect } from 'react';

import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { defined } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const liquidityItemStore = useLiquidityItemStore();

  useEffect(() => {
    liquidityItemStore.setTokenPairSlug(defined(pairSlug, 'pairSlug'));
    void liquidityItemStore.itemSore.load();

    return () => liquidityItemStore.itemSore.resetData();
  }, [liquidityItemStore, pairSlug]);

  return {
    t,
    title: liquidityItemStore.pageTitle,
    isInitialized: Boolean(liquidityItemStore.item)
  };
};
