import { useMemo } from 'react';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { useLiquidityV3PositionStore, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { toAtomic } from '@shared/helpers';

import { calculateTicks, findUserPosition } from '../../../helpers';
import { usePositionsWithStats } from '../../../hooks';
import { useTickSpacing } from './use-tick-spacing';

export const usePositionTicks = () => {
  const priceDecimals = useV3PoolPriceDecimals();
  const tickSpacing = useTickSpacing();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();

  const position = findUserPosition(positionsWithStats, positionId);

  const minPrice = position?.stats.minRange;
  const maxPrice = position?.stats.maxRange;

  return useMemo(() => {
    return {
      tickSpacing,
      ...calculateTicks(
        toAtomic(minPrice ?? ZERO_AMOUNT_BN, priceDecimals),
        toAtomic(maxPrice ?? ZERO_AMOUNT_BN, priceDecimals),
        tickSpacing
      )
    };
  }, [tickSpacing, minPrice, priceDecimals, maxPrice]);
};
