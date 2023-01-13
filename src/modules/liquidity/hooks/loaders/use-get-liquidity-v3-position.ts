import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { useLiquidityV3PositionsStore } from '../store';

export const useGetLiquidityV3Position = () => {
  const { showErrorToast } = useToasts();
  const isReady = useReady();
  const v3PositionsStore = useLiquidityV3PositionsStore();

  const getLiquidityV3Position = useCallback(async () => {
    if (!isReady) {
      return;
    }

    try {
      await v3PositionsStore.positionsStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, v3PositionsStore.positionsStore, showErrorToast]);

  const delayedGetLiquidityV3Position = useCallback(async () => {
    await sleep(DELAY_BEFORE_DATA_UPDATE);

    await getLiquidityV3Position();
  }, [getLiquidityV3Position]);

  return { getLiquidityV3Position, delayedGetLiquidityV3Position };
};
