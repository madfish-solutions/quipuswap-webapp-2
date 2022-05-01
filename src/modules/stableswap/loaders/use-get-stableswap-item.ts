import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useStableswapItemStore } from '../hooks';

export const useGetStableswapItem = () => {
  const { showErrorToast } = useToasts();
  const stableswapItemStore = useStableswapItemStore();
  const isReady = useReady();

  const getStableswapItem = useCallback(
    async (poolId: BigNumber) => {
      if (isReady) {
        try {
          stableswapItemStore.setPoolId(poolId);
          stableswapItemStore.itemStore.load();
        } catch (error) {
          showErrorToast(error as Error);
        }
      }
    },
    [isReady, showErrorToast, stableswapItemStore]
  );

  return { getStableswapItem };
};
