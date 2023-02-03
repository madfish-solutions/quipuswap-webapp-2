import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';
import { useLiquidityV3CurrentPrice } from '@modules/liquidity/hooks';
import { decreaseByPercentage, increaseByPercentage, isNull } from '@shared/helpers';

import { useToPriceRangeInputValue } from './use-to-price-range-input-value';

const LOWER_PRICE_DELTA_PERCENTAGE = 50;
const UPPER_PRICE_DELTA_PERCENTAGE = 50;

export const useInitialPriceRange = (priceRangeDecimals: number) => {
  const currentPrice = useLiquidityV3CurrentPrice();
  const toPriceRangeInputValue = useToPriceRangeInputValue(priceRangeDecimals);

  return useMemo(() => {
    if (isNull(currentPrice)) {
      return {
        minPrice: EMPTY_STRING,
        maxPrice: EMPTY_STRING
      };
    }

    const basicMinPrice = decreaseByPercentage(currentPrice, new BigNumber(LOWER_PRICE_DELTA_PERCENTAGE));
    const basicMaxPrice = increaseByPercentage(currentPrice, new BigNumber(UPPER_PRICE_DELTA_PERCENTAGE));

    return {
      minPrice: toPriceRangeInputValue(basicMinPrice),
      maxPrice: toPriceRangeInputValue(basicMaxPrice)
    };
  }, [currentPrice, toPriceRangeInputValue]);
};
