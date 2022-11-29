import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useRedirectToNotFoundLettersRoute } from '@shared/helpers';

import { useStableswapItemStore } from '../store';

export const useGetStableswapItem = () => {
  const stableswapItemStore = useStableswapItemStore();
  const isReady = useReady();
  const redirectToNotFoundPage = useRedirectToNotFoundLettersRoute();

  const getStableswapItem = useCallback(
    async (poolId: BigNumber) => {
      if (!isReady) {
        return;
      }

      try {
        stableswapItemStore.setPoolId(poolId);
        await stableswapItemStore.itemStore.load();
      } catch (error) {
        redirectToNotFoundPage();
      }
    },
    [isReady, stableswapItemStore, redirectToNotFoundPage]
  );

  return { getStableswapItem };
};
