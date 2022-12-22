import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { toAtomic } from '@shared/helpers';

import { calculateTicks } from '../../helpers';
import { CreatePositionInput } from '../../types/create-position-form';
import { useTickSpacing } from './use-tick-spacing';

export const usePositionTicks = (formik: ReturnType<typeof useFormik>) => {
  const priceDecimals = useV3PoolPriceDecimals();
  const tickSpacing = useTickSpacing();

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
