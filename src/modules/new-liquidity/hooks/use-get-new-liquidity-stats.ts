import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useNewLiquidityStatsStore } from './store';

export const useGetNewLiquidityStats = () => {
  const { showErrorToast } = useToasts();
  const newLiquidityStatsStore = useNewLiquidityStatsStore();
  const isReady = useReady();

  const getNewLiquidityStats = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await newLiquidityStatsStore?.statsStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, showErrorToast, newLiquidityStatsStore?.statsStore]);

  return { getNewLiquidityStats };
};
