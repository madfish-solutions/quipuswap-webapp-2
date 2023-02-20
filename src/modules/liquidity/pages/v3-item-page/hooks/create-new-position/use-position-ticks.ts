import { useMemo } from 'react';

import { useV3PoolPriceDecimals, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { CreatePositionFormik } from '@modules/liquidity/types';
import { getInvertedValue, stringToBigNumber, toAtomic } from '@shared/helpers';

import { calculateTicks } from '../../helpers';
import { CreatePositionInput } from '../../types/create-position-form';
import { useTickSpacing } from './use-tick-spacing';

export const usePositionTicks = (formik: CreatePositionFormik) => {
  const priceDecimals = useV3PoolPriceDecimals();
  const tickSpacing = useTickSpacing();
  const poolStore = useLiquidityV3PoolStore();

  const { [CreatePositionInput.MIN_PRICE]: rawMinPrice, [CreatePositionInput.MAX_PRICE]: rawMaxPrice } = formik.values;

  return useMemo(() => {
    const shouldShowTokenXToYPrice = poolStore.localShouldShowXToYPrice;
    const minPrice = shouldShowTokenXToYPrice
      ? getInvertedValue(stringToBigNumber(rawMaxPrice))
      : stringToBigNumber(rawMinPrice);
    const maxPrice = shouldShowTokenXToYPrice
      ? getInvertedValue(stringToBigNumber(rawMinPrice))
      : stringToBigNumber(rawMaxPrice);

    return {
      tickSpacing,
      ...calculateTicks(toAtomic(minPrice, priceDecimals), toAtomic(maxPrice, priceDecimals), tickSpacing)
    };
  }, [rawMinPrice, rawMaxPrice, tickSpacing, priceDecimals, poolStore]);
};
