import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useFarmingListCommonStore } from '@modules/farming/hooks';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

export const useGetFarmingListCommon = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const farmingListStore = useFarmingListCommonStore();
  const { listStore, listBalancesStore } = farmingListStore;

  const getFarmingListCommon = useCallback(async () => {
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
  }, [isReady, authStore.accountPkh, listStore, listBalancesStore, showErrorToast]);

  const delayedGetFarmingListCommon = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getFarmingListCommon();
  }, [getFarmingListCommon]);

  return { getFarmingListCommon, delayedGetFarmingListCommon };
};
