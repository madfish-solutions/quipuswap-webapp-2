import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useGetNewLiquidityItem, useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';

export const useDexTwoPageContainerViewModel = () => {
  const { pairSlug } = useParams();
  const newLiquidityItemStore = useNewLiquidityItemStore();
  const { getNewLiquidityItem } = useGetNewLiquidityItem();

  useEffect(() => {
    newLiquidityItemStore.setTokenPairSlug(pairSlug!);
    void getNewLiquidityItem();

    return () => newLiquidityItemStore.itemSore.resetData();
  }, [getNewLiquidityItem, newLiquidityItemStore, pairSlug]);

  return {
    isInitialized: Boolean(newLiquidityItemStore.item)
  };
};
