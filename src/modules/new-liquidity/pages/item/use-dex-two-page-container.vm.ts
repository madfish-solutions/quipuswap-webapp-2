import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';

export const useDexTwoPageContainerViewModel = () => {
  const { pairSlug } = useParams();
  const newLiquidityItemStore = useNewLiquidityItemStore();

  useEffect(() => {
    newLiquidityItemStore.setTokenPairSlug(pairSlug!);
    void newLiquidityItemStore.itemSore.load();

    return () => newLiquidityItemStore.itemSore.resetData();
  }, [newLiquidityItemStore, pairSlug]);

  return {
    isInitialized: Boolean(newLiquidityItemStore.item)
  };
};
