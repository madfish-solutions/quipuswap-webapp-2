import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@app.config';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useReady } from '@utils/dapp';
import { sleep } from '@utils/helpers/sleep';

export const useGetStakingStats = () => {
  const { showErrorToast } = useToasts();
  const stakingListStore = useStakingListStore();
  const isReady = useReady();

  const getStakingStats = useCallback(async () => {
    if (isReady) {
      try {
        await stakingListStore.statsStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isReady, showErrorToast, stakingListStore.statsStore]);

  const delayedGetStakingStats = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getStakingStats();
  }, [getStakingStats]);

  return { getStakingStats, delayedGetStakingStats };
};
