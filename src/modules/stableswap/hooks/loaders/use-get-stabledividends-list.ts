import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useStableDividendsListStore } from '../store';

export const useGetStableDividendsList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const { listStore, stakerInfo, statsStore } = useStableDividendsListStore();

  const getStableDividendsList = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await listStore.load();
      await statsStore.load();
      await stakerInfo.load();
    } catch (error) {
      showErrorToast(error as Error);
    }

    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [isReady, authStore.accountPkh, listStore, stakerInfo, statsStore, showErrorToast]);

  return { getStableDividendsList };
};
