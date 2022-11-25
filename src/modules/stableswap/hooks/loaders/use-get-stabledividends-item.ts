import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useRedirectToNotFoundLettersRoute } from '@shared/helpers';

import { useStableDividendsItemStore } from '../store';

export const useGetStableDividendsItem = () => {
  const stableDividendsItemStore = useStableDividendsItemStore();
  const isReady = useReady();
  const redirectToNotFoundPage = useRedirectToNotFoundLettersRoute();

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
        redirectToNotFoundPage();
      }
    },
    [isReady, stableDividendsItemStore, redirectToNotFoundPage]
  );

  return { getStableDividendsItem };
};
