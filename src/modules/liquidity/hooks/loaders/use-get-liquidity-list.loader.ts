import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

import { useLiquidityListStore } from '../store';

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

  return { getLiquidityList };
};
