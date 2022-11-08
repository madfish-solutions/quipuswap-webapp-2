import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useFarmingListCommonStore } from '../stores';

export const useGetFarmingList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const { listStore, listBalancesStore } = useFarmingListCommonStore();

  const getFarmingList = useCallback(async () => {
    if (isReady) {
      try {
        await listStore.load();
        await listBalancesStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [isReady, authStore.accountPkh, listStore, showErrorToast, listBalancesStore]);

  const delayedGetFarmingList = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getFarmingList();
  }, [getFarmingList]);

  return { getFarmingList, delayedGetFarmingList };
};
