import { useEffect } from 'react';

import { useCpmmPairSlug, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useCpmmPairSlug();
  const liquidityItemStore = useLiquidityItemStore();
  const { liquidityListStore } = useRootStore();

  useEffect(() => {
    if (isExist(pairSlug)) {
      (async () => {
        await liquidityListStore?.listStore.load();
        liquidityItemStore.setTokenPairSlug(pairSlug);
        void liquidityItemStore.itemSore.load();
      })();
    }

    return () => liquidityItemStore.itemSore.resetData();
  }, [liquidityItemStore, liquidityListStore?.listStore, pairSlug]);

  return {
    t,
    title: liquidityItemStore.pageTitle,
    isInitialized: pairSlug ? Boolean(liquidityItemStore.item) : true
  };
};
