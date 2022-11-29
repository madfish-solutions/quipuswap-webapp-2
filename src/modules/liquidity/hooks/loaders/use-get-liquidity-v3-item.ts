import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { useToasts } from '@shared/utils';

import { useLiquidityV3ItemStore } from '../store';

export const useGetLiquidityV3Item = () => {
  const { showErrorToast } = useToasts();
  const liquidityV3ItemStore = useLiquidityV3ItemStore();
  const isReady = useReady();

  const getLiquidityV3Item = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await liquidityV3ItemStore.contractBalanceStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, liquidityV3ItemStore.contractBalanceStore, showErrorToast]);

  return { getLiquidityV3Item };
};
