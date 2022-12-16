import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useLiquidityV3PoolStore } from '../store';

export const useGetLiquidityV3Pool = () => {
  const { showErrorToast } = useToasts();
  const liquidityV3PoolStore = useLiquidityV3PoolStore();
  const isReady = useReady();

  const getLiquidityV3Pool = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await liquidityV3PoolStore.contractBalanceStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, liquidityV3PoolStore.contractBalanceStore, showErrorToast]);

  return { getLiquidityV3Pool };
};
