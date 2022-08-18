import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useNewLiquidityListStore } from '../store';

export const useGetNewLiquidityList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const newLiquidityListStore = useNewLiquidityListStore();

  const getNewLiquidityList = useCallback(async () => {
    if (isReady && newLiquidityListStore) {
      try {
        await newLiquidityListStore.listStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [isReady, newLiquidityListStore, authStore.accountPkh, showErrorToast]);

  const delayedGetNewLiquidityList = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getNewLiquidityList();
  }, [getNewLiquidityList]);

  return { getNewLiquidityList, delayedGetNewLiquidityList };
};
