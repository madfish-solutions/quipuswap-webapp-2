import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { useLiquidityV3PoolStore, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { toAtomic } from '@shared/helpers';

import { calculateTicks } from '../../helpers';
import { CreatePositionInput } from '../../types/create-position-form';

export const usePositionTicks = (formik: ReturnType<typeof useFormik>) => {
  const priceDecimals = useV3PoolPriceDecimals();
  const poolStore = useLiquidityV3PoolStore();
  const tickSpacing = poolStore.item?.storage.constants.tick_spacing.toNumber();

  const { [CreatePositionInput.MIN_PRICE]: rawMinPrice, [CreatePositionInput.MAX_PRICE]: rawMaxPrice } = formik.values;

  return useMemo(() => {
    return {
      tickSpacing,
      ...calculateTicks(
        toAtomic(new BigNumber(rawMinPrice), priceDecimals),
        toAtomic(new BigNumber(rawMaxPrice), priceDecimals),
        tickSpacing
      )
    };
  }, [priceDecimals, tickSpacing, rawMinPrice, rawMaxPrice]);
};
