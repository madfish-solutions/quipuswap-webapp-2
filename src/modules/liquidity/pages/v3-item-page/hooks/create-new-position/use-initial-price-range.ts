import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';
import { useLiquidityV3CurrentYToXPrice, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { decreaseByPercentage, getInvertedValue, increaseByPercentage, isNull } from '@shared/helpers';

import { useToPriceRangeInputValue } from './use-to-price-range-input-value';

const LOWER_PRICE_DELTA_PERCENTAGE = 50;
const UPPER_PRICE_DELTA_PERCENTAGE = 50;

export const useInitialPriceRange = (priceRangeDecimals: number) => {
  const currentYToXPrice = useLiquidityV3CurrentYToXPrice();
  const toPriceRangeInputValue = useToPriceRangeInputValue(priceRangeDecimals);
  const poolStore = useLiquidityV3PoolStore();

  return useMemo(() => {
    const shouldShowTokenXToYPrice = poolStore.localShouldShowXToYPrice;
    if (isNull(currentYToXPrice)) {
      return {
        minPrice: EMPTY_STRING,
        maxPrice: EMPTY_STRING
      };
    }

    const currentPrice = shouldShowTokenXToYPrice ? getInvertedValue(currentYToXPrice) : currentYToXPrice;

    const basicMinPrice = decreaseByPercentage(currentPrice, new BigNumber(LOWER_PRICE_DELTA_PERCENTAGE));
    const basicMaxPrice = increaseByPercentage(currentPrice, new BigNumber(UPPER_PRICE_DELTA_PERCENTAGE));

    return {
      minPrice: toPriceRangeInputValue(basicMinPrice),
      maxPrice: toPriceRangeInputValue(basicMaxPrice)
    };
  }, [currentYToXPrice, toPriceRangeInputValue, poolStore]);
};
