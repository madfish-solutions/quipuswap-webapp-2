import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useLiquidityV3PoolStore, useLiquidityV3PositionsStore } from '../store';

export const useGetLiquidityV3ItemWithPositions = () => {
  const { showErrorToast } = useToasts();
  const liquidityV3ItemStore = useLiquidityV3PoolStore();
  const liquidityV3PositionsStore = useLiquidityV3PositionsStore();
  const isReady = useReady();

  const getLiquidityV3ItemWithPositions = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await liquidityV3ItemStore.itemSore.load();
      await liquidityV3ItemStore.contractBalanceStore.load();
      await liquidityV3PositionsStore.positionsStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, liquidityV3ItemStore, liquidityV3PositionsStore, showErrorToast]);

  return { getLiquidityV3ItemWithPositions };
};
