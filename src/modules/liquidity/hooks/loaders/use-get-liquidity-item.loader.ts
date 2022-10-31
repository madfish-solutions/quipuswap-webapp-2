import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useToasts } from '@shared/utils';

export const useGetLiquidityItem = () => {
  const { showErrorToast } = useToasts();
  const authStore = useAuthStore();
  const isReady = useReady();

  const liquidityItemStore = useLiquidityItemStore();

  const getLiquidityItem = useCallback(async () => {
    if (isReady) {
      try {
        await liquidityItemStore.itemSore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
    // We need it only for dependency for loading list based on it.
    noopMap(authStore.accountPkh);
  }, [authStore.accountPkh, isReady, liquidityItemStore.itemSore, showErrorToast]);

  const delayedGetLiquidityItem = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getLiquidityItem();
  }, [getLiquidityItem]);

  return { getLiquidityItem, delayedGetLiquidityItem };
};
