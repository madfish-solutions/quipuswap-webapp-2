import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';

import { useNewLiquidityListStore } from '../store';

export const useGetNewLiquidityList = () => {
  const authStore = useAuthStore();
  const isReady = useReady();
  const newLiquidityListStore = useNewLiquidityListStore();

  const getNewLiquidityList = useCallback(async () => {
    if (isReady && newLiquidityListStore) {
      await newLiquidityListStore.listStore.load();
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [isReady, newLiquidityListStore, authStore.accountPkh]);

  return { getNewLiquidityList };
};
