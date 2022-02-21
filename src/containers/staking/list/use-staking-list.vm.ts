import { useEffect } from 'react';

import { getStakingListApi, getStakingStatsApi } from '@api/staking';
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
      if (!isLoading && authStore.accountPkh) {
        try {
          stakingListStore.list.startLoading();
          stakingListStore.stats.startLoading();
          const [list, stats] = await Promise.all([
            await getStakingListApi(authStore.accountPkh),
            await getStakingStatsApi()
          ]);
          stakingListStore.list.setData(list);
          stakingListStore.stats.setData(stats);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('error', error);
          showErrorToast(error as Error);
        } finally {
          stakingListStore.list.finishLoading();
          stakingListStore.stats.finishLoading();
        }
      }
    };

    void load();
  }, [stakingListStore, authStore.accountPkh, isLoading, showErrorToast]);

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
