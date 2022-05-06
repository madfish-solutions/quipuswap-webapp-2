import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useStableswapListStore } from '../store';

export const useGetStableswapStats = () => {
  const { showErrorToast } = useToasts();
  const stableswapListStore = useStableswapListStore();
  const isReady = useReady();

  const getStableswapStats = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await stableswapListStore.statsStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, showErrorToast, stableswapListStore.statsStore]);

  return { getStableswapStats };
};
