import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { useFarmingListStore } from '../stores/use-farming-list-store';

export const useGetFarmingStats = () => {
  const { showErrorToast } = useToasts();
  const farmingListStore = useFarmingListStore();
  const isReady = useReady();

  const getFarmingStats = useCallback(async () => {
    if (isReady) {
      try {
        //TODO
        await farmingListStore?.statsStore.load();
      } catch (error) {
        showErrorToast('Error: Server is unavailable');
      }
    }
  }, [isReady, showErrorToast, farmingListStore?.statsStore]);

  const delayedGetFarmingStats = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getFarmingStats();
  }, [getFarmingStats]);

  return { getFarmingStats, delayedGetFarmingStats };
};
