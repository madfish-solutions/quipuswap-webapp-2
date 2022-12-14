import { useMemo } from 'react';

import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3ItemStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { isNull } from '@shared/helpers';

import { mapPositionWithStats } from '../helpers';
import { useLiquidityV3ItemTokensExchangeRates } from './use-liquidity-v3-item-tokens-exchange-rates';

export const usePositionsWithStats = () => {
  const currentPrice = useLiquidityV3CurrentPrice();
  const itemStore = useLiquidityV3ItemStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tokenXExchangeRate, tokenYExchangeRate } = useLiquidityV3ItemTokensExchangeRates();

  const rawPositions = v3PositionsStore.positions;
  const item = itemStore.item;

  const loading = itemStore.itemIsLoading || v3PositionsStore.positionsAreLoading || isNull(tokenX) || isNull(tokenY);
  const error = itemStore.error ?? v3PositionsStore.positionsStore.error;

  const positionsWithStats = useMemo(() => {
    if (isNull(rawPositions) || isNull(tokenX) || isNull(tokenY) || isNull(item)) {
      return [];
    }

    return rawPositions.map(
      mapPositionWithStats(tokenX, tokenY, currentPrice, tokenXExchangeRate, tokenYExchangeRate, item.storage)
    );
  }, [rawPositions, tokenX, tokenY, currentPrice, tokenXExchangeRate, tokenYExchangeRate, item]);

  return { positionsWithStats, loading, error };
};
