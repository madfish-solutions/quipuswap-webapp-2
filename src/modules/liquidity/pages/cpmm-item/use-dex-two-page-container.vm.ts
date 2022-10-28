import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useGetLiquidityItem, useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';

export const useDexTwoPageContainerViewModel = () => {
  const { pairSlug } = useParams();
  const newLiquidityItemStore = useLiquidityItemStore();
  const { getNewLiquidityItem } = useGetLiquidityItem();
  const authStore = useAuthStore();

  useEffect(() => {
    newLiquidityItemStore.setTokenPairSlug(pairSlug!);
    void getNewLiquidityItem();

    noopMap(authStore.accountPkh);

    return () => newLiquidityItemStore.itemSore.resetData();
  }, [authStore.accountPkh, getNewLiquidityItem, newLiquidityItemStore, pairSlug]);

  return {
    isInitialized: Boolean(newLiquidityItemStore.item)
  };
};
