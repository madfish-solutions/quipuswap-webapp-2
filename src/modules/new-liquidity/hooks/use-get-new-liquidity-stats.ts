import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useNewLiquidityListStore } from './use-new-liquidity-list.store';

export const useGetNewLiquidityStats = () => {
  const { showErrorToast } = useToasts();
  const newLiquidityListStore = useNewLiquidityListStore();
  const isReady = useReady();

  const getNewLiquidityStats = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await newLiquidityListStore?.statsStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, showErrorToast, newLiquidityListStore?.statsStore]);

  return { getNewLiquidityStats };
};
