import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

export const useGetNewLiquidityItem = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();

  const newLiquidityItemStore = useNewLiquidityItemStore();

  const getNewLiquidityItem = useCallback(async () => {
    if (isReady) {
      try {
        await newLiquidityItemStore.itemSore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [authStore.accountPkh, isReady, newLiquidityItemStore.itemSore, showErrorToast]);

  const delayedGetNewLiquidityItem = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getNewLiquidityItem();
  }, [getNewLiquidityItem]);

  return { getNewLiquidityItem, delayedGetNewLiquidityItem };
};
