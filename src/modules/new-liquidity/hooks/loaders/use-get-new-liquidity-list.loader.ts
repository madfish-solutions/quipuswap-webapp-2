import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useNewLiquidityListStore } from '../store';

export const useGetNewLiquidityList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const newLiquidityListStore = useNewLiquidityListStore();

  const getNewLiquidityList = useCallback(async () => {
    if (!isReady || !newLiquidityListStore) {
      return;
    }

    try {
      await newLiquidityListStore.listStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [isReady, newLiquidityListStore, authStore.accountPkh, showErrorToast]);

  return { getNewLiquidityList };
};
