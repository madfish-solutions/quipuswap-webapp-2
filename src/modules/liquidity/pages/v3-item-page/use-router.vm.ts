import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useLiquidityV3PoolStore, useLiquidityV3PositionStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isEmptyArray, isExist, isNotFoundError, isNull } from '@shared/helpers';

import { findUserPosition } from './helpers';
import { usePositionsWithStats } from './hooks/use-positions-with-stats';
import { useRouteParams } from './hooks/use-route-params';
export const useRouterViewModel = () => {
  const { tezos } = useRootStore();
  const { poolId, positionId } = useRouteParams();
  const poolStore = useLiquidityV3PoolStore();
  const positionStore = useLiquidityV3PositionStore();
  const { positionsWithStats } = usePositionsWithStats();

  const userPositionExist = Boolean(findUserPosition(positionsWithStats, positionId));
  const isPageExist = isNull(positionId) || isEmptyArray(positionsWithStats) ? false : !userPositionExist;

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
    isNotFound: isPageExist || (poolStore.error && isNotFoundError(poolStore.error)),
    error: poolStore.error
  };
};
