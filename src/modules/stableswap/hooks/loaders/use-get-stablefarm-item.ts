import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useStableDividendsItemStore } from '../store';

export const useGetStableDividendsItem = () => {
  const { showErrorToast } = useToasts();
  const stableDividendsItemStore = useStableDividendsItemStore();
  const isReady = useReady();

  const getStableDividendsItem = useCallback(
    async (poolId: BigNumber) => {
      if (!isReady) {
        return;
      }

      try {
        stableDividendsItemStore.setPoolId(poolId);
        await stableDividendsItemStore.itemStore.load();
        await stableDividendsItemStore.stakerInfoStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [isReady, showErrorToast, stableDividendsItemStore]
  );

  return { getStableDividendsItem };
};
