import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useTranslation } from '@translation';

export const useDexTwoItemPageViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();
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
