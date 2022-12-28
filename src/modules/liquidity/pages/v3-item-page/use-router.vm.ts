import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import {
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useLiquidityV3PositionStore
} from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isEmptyArray, isExist, isNotFoundError, isNull, onlyDigits } from '@shared/helpers';

import { findUserPosition, InvalidPoolIdError } from './helpers';
import { usePositionsWithStats } from './hooks/use-positions-with-stats';
import { useRouteParams } from './hooks/use-route-params';

export const useRouterViewModel = () => {
  const { tezos } = useRootStore();
  const { id, positionId } = useRouteParams();
  const poolStore = useLiquidityV3PoolStore();
  const positionStore = useLiquidityV3PositionStore();
  const { positionsWithStats } = usePositionsWithStats();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const tokensAreLoading = isNull(tokenX) || isNull(tokenY);
  const userPositionExist = Boolean(findUserPosition(positionsWithStats, positionId ?? null));
  const userPositionNotFound =
    !(isNull(positionId) || isEmptyArray(positionsWithStats)) && !userPositionExist && positionId;

  useEffect(() => {
    if (isExist(id) && onlyDigits(id) !== id) {
      poolStore.setError(new InvalidPoolIdError(id));
    } else if (isExist(id) && tezos) {
      if (isExist(positionId)) {
        positionStore.setPositionId(new BigNumber(positionId));
      }
      poolStore.setPoolId(new BigNumber(id));
      (async () => {
        try {
          await poolStore.itemSore.load();
        } catch (_error) {
          poolStore.setError(_error as Error);
        }
      })();
    }

    return () => poolStore.itemSore.resetData();
  }, [poolStore, id, positionId, tezos, positionStore]);

  return {
    isLoading: poolStore.itemIsLoading || tokensAreLoading,
    isNotFound: userPositionNotFound || (poolStore.error && isNotFoundError(poolStore.error)),
    error: poolStore.error
  };
};
