import { useEffect } from 'react';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';

export const useStakingListViewModel = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const stakingListStore = useStakingListStore();
  const isLoading = useIsLoading();
  /*
    Load data
   */
  useEffect(() => {
    const load = async () => {
      if (!isLoading) {
        await stakingListStore.list.load();
      }
    };

    void load();
  }, [stakingListStore, authStore.accountPkh, isLoading]);

  /*
    Handle errors
   */
  useEffect(() => {
    if (stakingListStore.list.error?.message) {
      showErrorToast(stakingListStore.list.error?.message);
    }
  }, [showErrorToast, stakingListStore.list.error]);

  return {
    isLoading: isLoading || stakingListStore.list.isLoading,
    list: stakingListStore.list,
    error: stakingListStore.list.error
  };
};
