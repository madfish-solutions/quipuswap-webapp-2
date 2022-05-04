import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useStableswapListStore } from '../store';

export const useGetStableswapList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const { listStore } = useStableswapListStore();

  const getStableswapList = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await listStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }

    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [authStore.accountPkh, isReady, showErrorToast, listStore]);

  return { getStableswapList };
};
