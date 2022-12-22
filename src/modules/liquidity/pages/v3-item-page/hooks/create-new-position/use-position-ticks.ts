import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { useLiquidityV3CurrentPrice, useLiquidityV3PoolStore, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { toAtomic } from '@shared/helpers';

import { calculateTickIndex, calculateTicks } from '../../helpers';
import { CreatePositionInput } from '../../types/create-position-form';

export const usePositionTicks = (formik: ReturnType<typeof useFormik>) => {
  const currentPrice = useLiquidityV3CurrentPrice();
  const priceDecimals = useV3PoolPriceDecimals();
  const poolStore = useLiquidityV3PoolStore();
  const tickSpacing = poolStore.item?.storage.constants.tick_spacing.toNumber();

  const { [CreatePositionInput.MIN_PRICE]: rawMinPrice, [CreatePositionInput.MAX_PRICE]: rawMaxPrice } = formik.values;

  return useMemo(() => {
    return {
      currentTick: currentPrice && {
        price: toAtomic(currentPrice, priceDecimals),
        index: calculateTickIndex(toAtomic(currentPrice, priceDecimals))
      },
      tickSpacing,
      ...calculateTicks(
        toAtomic(new BigNumber(rawMinPrice), priceDecimals),
        toAtomic(new BigNumber(rawMaxPrice), priceDecimals),
        tickSpacing
      )
    };
  }, [currentPrice, priceDecimals, tickSpacing, rawMinPrice, rawMaxPrice]);
};
