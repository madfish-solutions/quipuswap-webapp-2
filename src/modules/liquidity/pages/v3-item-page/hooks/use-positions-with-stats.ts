import { useMemo } from 'react';

import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { isNull } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';

import { mapPositionWithStats } from '../helpers';

export const usePositionsWithStats = () => {
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const currentPrice = useLiquidityV3CurrentPrice();
  const poolStore = useLiquidityV3PoolStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const rawPositions = v3PositionsStore.positions;

  const loading = poolStore.itemIsLoading || v3PositionsStore.positionsAreLoading || isNull(tokenX) || isNull(tokenY);
  const error = poolStore.error ?? v3PositionsStore.positionsStore.error;

  const positionsWithStats = useMemo(() => {
    if (isNull(rawPositions) || isNull(tokenX) || isNull(tokenY)) {
      return [];
    }

    return rawPositions.map(mapPositionWithStats(tokenX, tokenY, currentPrice, getTokenExchangeRate));
  }, [rawPositions, tokenX, tokenY, currentPrice, getTokenExchangeRate]);

  return { positionsWithStats, loading, error };
};
