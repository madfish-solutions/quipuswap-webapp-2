import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/config';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useFarmingListStore } from '../stores/use-farming-list-store';

export const useGetFarmingList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const farmingListStore = useFarmingListStore();
  const { listStore } = farmingListStore!;

  const getFarmingList = useCallback(async () => {
    if (isReady) {
      try {
        await listStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [authStore.accountPkh, isReady, showErrorToast, listStore]);

  const delayedGetFarmingList = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getFarmingList();
  }, [getFarmingList]);

  return { getFarmingList, delayedGetFarmingList };
};
