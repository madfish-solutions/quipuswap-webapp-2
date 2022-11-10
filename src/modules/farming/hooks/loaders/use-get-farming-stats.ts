import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { useFarmingListStatsStore } from '../stores';

export const useGetFarmingStats = () => {
  const { showErrorToast } = useToasts();
  const { statsStore } = useFarmingListStatsStore();
  const isReady = useReady();

  const getFarmingStats = useCallback(async () => {
    if (isReady) {
      try {
        await statsStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isReady, showErrorToast, statsStore]);

  const delayedGetFarmingStats = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getFarmingStats();
  }, [getFarmingStats]);

  return { getFarmingStats, delayedGetFarmingStats };
};
