import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useNewLiquidityStore } from './store';

export const useGetNewLiquidityStats = () => {
  const { showErrorToast } = useToasts();
  const newLiquidityStore = useNewLiquidityStore();
  const isReady = useReady();

  const getNewLiquidityStats = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await newLiquidityStore?.statsStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, showErrorToast, newLiquidityStore?.statsStore]);

  return { getNewLiquidityStats };
};
