import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@app.config';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useFarmingListStore } from '@hooks/stores/use-farming-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useReady } from '@utils/dapp';
import { sleep } from '@utils/helpers/sleep';
import { noopMap } from '@utils/mapping/noop.map';

export const useGetFarmingList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const farmingListStore = useFarmingListStore();
  const { listStore } = farmingListStore;

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
