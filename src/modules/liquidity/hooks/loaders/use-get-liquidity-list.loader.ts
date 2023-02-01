import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useLiquidityListStore } from '../store';

const DELAY_BEFORE_DATA_UPDATE = 45000;

export const useGetLiquidityList = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();
  const liquidityListStore = useLiquidityListStore();

  const getLiquidityList = useCallback(async () => {
    if (!isReady || !liquidityListStore) {
      return;
    }

    try {
      await liquidityListStore.listStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [isReady, liquidityListStore, authStore.accountPkh, showErrorToast]);

  const delayedGetLiquidityList = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);
    await getLiquidityList();
  }, [getLiquidityList]);

  return { getLiquidityList, delayedGetLiquidityList };
};
