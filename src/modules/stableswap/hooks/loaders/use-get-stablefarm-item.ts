import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useStableFarmItemStore } from '../store';

export const useGetStableFarmItem = () => {
  const { showErrorToast } = useToasts();
  const stableFarmItemStore = useStableFarmItemStore();
  const isReady = useReady();

  const getStableFarmItem = useCallback(
    async (poolId: BigNumber) => {
      if (!isReady) {
        return;
      }

      try {
        stableFarmItemStore.setPoolId(poolId);
        await stableFarmItemStore.itemStore.load();
        await stableFarmItemStore.stakerInfoStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [isReady, showErrorToast, stableFarmItemStore]
  );

  return { getStableFarmItem };
};
