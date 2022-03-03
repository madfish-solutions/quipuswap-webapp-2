import { useCallback } from 'react';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';
import { noopMap } from '@utils/mapping/noop.map';

export const useGetStakingList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isLoading = useIsLoading();
  const stakingListStore = useStakingListStore();
  const { listStore } = stakingListStore;

  const getStakingList = useCallback(async () => {
    if (!isLoading) {
      try {
        await listStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [authStore.accountPkh, isLoading, showErrorToast, listStore]);

  return { getStakingList };
};
