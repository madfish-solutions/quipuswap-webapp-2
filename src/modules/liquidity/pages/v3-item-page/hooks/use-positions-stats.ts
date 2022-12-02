import { useMemo } from 'react';

import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3ItemStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { isNull } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';

import { mapPosition } from '../helpers';

export const usePositionsStats = () => {
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const currentPrice = useLiquidityV3CurrentPrice();
  const itemStore = useLiquidityV3ItemStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const id = v3PositionsStore.poolId?.toFixed();
  const rawPositions = v3PositionsStore.positions;

  const loading = itemStore.itemIsLoading || v3PositionsStore.positionsAreLoading || isNull(tokenX) || isNull(tokenY);
  const error = itemStore.error ?? v3PositionsStore.positionsStore.error;

  const stats = useMemo(() => {
    if (isNull(rawPositions) || isNull(tokenX) || isNull(tokenY)) {
      return [];
    }

    return rawPositions.map(mapPosition(tokenX, tokenY, currentPrice, getTokenExchangeRate, id));
  }, [rawPositions, tokenX, tokenY, currentPrice, getTokenExchangeRate, id]);

  return { stats, loading, error };
};
