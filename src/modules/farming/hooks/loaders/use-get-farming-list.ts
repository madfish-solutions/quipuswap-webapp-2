import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE, serverIsUnavailbleMessage, SERVER_UNAVAILABLE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { isEqual, sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useFarmingListStore } from '../stores/use-farming-list-store';

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
        if (isEqual(error, SERVER_UNAVAILABLE)) {
          showErrorToast(serverIsUnavailbleMessage);
        }
        showErrorToast(error as Error);
      }
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [isReady, authStore.accountPkh, listStore, showErrorToast]);

  const delayedGetFarmingList = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getFarmingList();
  }, [getFarmingList]);

  return { getFarmingList, delayedGetFarmingList };
};
