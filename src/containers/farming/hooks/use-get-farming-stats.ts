import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@app.config';
import { useFarmingListStore } from '@hooks/stores/use-farming-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useReady } from '@utils/dapp';
import { sleep } from '@utils/helpers/sleep';

export const useGetFarmingStats = () => {
  const { showErrorToast } = useToasts();
  const farmingListStore = useFarmingListStore();
  const isReady = useReady();

  const getFarmingStats = useCallback(async () => {
    if (isReady) {
      try {
        await farmingListStore.statsStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isReady, showErrorToast, farmingListStore.statsStore]);

  const delayedGetFarmingStats = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getFarmingStats();
  }, [getFarmingStats]);

  return { getFarmingStats, delayedGetFarmingStats };
};
