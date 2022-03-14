import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@app.config';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useIsLoading } from '@utils/dapp';
import { sleep } from '@utils/helpers/sleep';

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

  const delayedGetStakingStats = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getStakingStats();
  }, [getStakingStats]);

  return { getStakingStats, delayedGetStakingStats };
};
