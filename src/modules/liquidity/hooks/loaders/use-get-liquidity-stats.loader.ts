import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useLiquidityListStore } from '../store';

export const useGetLiquidityStats = () => {
  const { showErrorToast } = useToasts();
  const newLiquidityListStore = useLiquidityListStore();
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
