import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { toAtomic, toReal } from '@shared/helpers';

import { calculateTick } from '../../helpers';
import { useTickSpacing } from './use-tick-spacing';

export const useToPriceRangeInputValue = (priceRangeDecimals: number) => {
  const priceDecimals = useV3PoolPriceDecimals();
  const tickSpacing = useTickSpacing();

  return useCallback(
    (inputPrice: BigNumber) => {
      const tick = calculateTick(toAtomic(inputPrice, priceDecimals), tickSpacing);

      return toReal(tick.price, priceDecimals).decimalPlaces(priceRangeDecimals, BigNumber.ROUND_CEIL).toFixed();
    },
    [priceDecimals, priceRangeDecimals, tickSpacing]
  );
};
