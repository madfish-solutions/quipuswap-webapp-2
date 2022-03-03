import { useCallback } from 'react';

import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';

export const useGetStakingStats = () => {
  const { showErrorToast } = useToasts();
  const stakingListStore = useStakingListStore();
  const isLoading = useIsLoading();

  const getStakingStats = useCallback(async () => {
    if (!isLoading) {
      try {
        await stakingListStore.statsStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isLoading, showErrorToast, stakingListStore.statsStore]);

  return { getStakingStats };
};
