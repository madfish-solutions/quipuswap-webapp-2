import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useLiquidityListStore } from '../store';

export const useGetLiquidityStats = () => {
  const { showErrorToast } = useToasts();
  const liquidityListStore = useLiquidityListStore();
  const isReady = useReady();

  const getLiquidityStats = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await liquidityListStore?.statsStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, showErrorToast, liquidityListStore?.statsStore]);

  return { getLiquidityStats };
};
