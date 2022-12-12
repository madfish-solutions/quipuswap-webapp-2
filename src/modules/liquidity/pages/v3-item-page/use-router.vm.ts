import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useLiquidityV3PoolStore, useLiquidityV3PositionStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, isNotFoundError } from '@shared/helpers';

import { useRouteParams } from './hooks/use-route-params';

export const useRouterViewModel = () => {
  const { tezos } = useRootStore();
  const { poolId, positionId } = useRouteParams();
  const poolStore = useLiquidityV3PoolStore();
  const positionStore = useLiquidityV3PositionStore();

  useEffect(() => {
    if (isExist(poolId) && tezos) {
      if (isExist(positionId)) {
        positionStore.setPositionId(new BigNumber(positionId));
      }
      poolStore.setPoolId(new BigNumber(poolId));
      (async () => {
        try {
          await poolStore.itemSore.load();
        } catch (_error) {
          poolStore.setError(_error as Error);
        }
      })();
    }

    return () => poolStore.itemSore.resetData();
  }, [poolStore, poolId, positionId, tezos, positionStore]);

  return {
    isLoading: poolStore.itemIsLoading,
    isNotFound: poolStore.error && isNotFoundError(poolStore.error),
    error: poolStore.error
  };
};
