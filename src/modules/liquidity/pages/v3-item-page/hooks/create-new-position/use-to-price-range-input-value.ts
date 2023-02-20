import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { INFINITY_SIGN } from '@config/constants';
import { useV3PoolPriceDecimals, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { getInvertedValue, toAtomic, toReal } from '@shared/helpers';

import { calculateTick } from '../../helpers';
import { useTickSpacing } from './use-tick-spacing';

export const useToPriceRangeInputValue = (priceRangeDecimals: number) => {
  const priceDecimals = useV3PoolPriceDecimals();
  const tickSpacing = useTickSpacing();
  const poolStore = useLiquidityV3PoolStore();

  return useCallback(
    (inputPrice: BigNumber) => {
      const shouldShowTokenXToYPrice = poolStore.localShouldShowXToYPrice;

      if (!inputPrice.isFinite()) {
        return inputPrice.isNaN() ? '' : `+${INFINITY_SIGN}`;
      }

      const yToXInputPrice = shouldShowTokenXToYPrice ? getInvertedValue(inputPrice) : inputPrice;

      const tick = calculateTick(toAtomic(yToXInputPrice, priceDecimals), tickSpacing);
      const realYToXPrice = toReal(tick.price, priceDecimals);
      const price = shouldShowTokenXToYPrice
        ? getInvertedValue(realYToXPrice).decimalPlaces(priceRangeDecimals, BigNumber.ROUND_FLOOR)
        : realYToXPrice.decimalPlaces(priceRangeDecimals, BigNumber.ROUND_CEIL);

      return price.toFixed();
    },
    [priceDecimals, priceRangeDecimals, tickSpacing, poolStore]
  );
};
