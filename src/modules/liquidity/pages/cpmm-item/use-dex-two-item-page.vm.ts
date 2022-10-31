import { useEffect } from 'react';

import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const liquidityItemStore = useLiquidityItemStore();

  useEffect(() => {
    if (isExist(pairSlug)) {
      liquidityItemStore.setTokenPairSlug(pairSlug);
      void liquidityItemStore.itemSore.load();
    }

    return () => liquidityItemStore.itemSore.resetData();
  }, [liquidityItemStore, pairSlug]);

  return {
    t,
    title: liquidityItemStore.pageTitle,
    isInitialized: pairSlug ? Boolean(liquidityItemStore.item) : true
  };
};
