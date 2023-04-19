import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { Version } from '@modules/stableswap/types';
import { useReady } from '@providers/use-dapp';
import { useRedirectToNotFoundLettersRoute } from '@shared/helpers';

import { useStableswapItemStore } from '../store';

export const useGetStableswapItem = () => {
  const stableswapItemStore = useStableswapItemStore();
  const isReady = useReady();
  const redirectToNotFoundPage = useRedirectToNotFoundLettersRoute();

  const getStableswapItem = useCallback(
    async (poolId: BigNumber, version: Version) => {
      if (!isReady) {
        return;
      }

      try {
        stableswapItemStore.setPoolId(poolId);
        stableswapItemStore.setVersion(version);
        await stableswapItemStore.itemStore.load();
      } catch (error) {
        redirectToNotFoundPage();
      }
    },
    [isReady, stableswapItemStore, redirectToNotFoundPage]
  );

  return { getStableswapItem };
};
