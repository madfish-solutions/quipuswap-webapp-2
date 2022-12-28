import BigNumber from 'bignumber.js';

import { MIN_TICK_INDEX } from '@config/constants';

import { calculateTick, fitUpperTick } from './v3-liquidity-helpers';

export const calculateTicks = (minPrice: BigNumber, maxPrice: BigNumber, tickSpacing?: number) => {
  const lowerTick = minPrice.isNaN() ? null : calculateTick(minPrice, tickSpacing);
  const upperTick = maxPrice.isNaN()
    ? null
    : fitUpperTick(
        calculateTick(maxPrice, tickSpacing),
        lowerTick?.index ?? new BigNumber(MIN_TICK_INDEX),
        tickSpacing
      );

  return { lowerTick, upperTick };
};
