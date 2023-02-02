import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT, INFINITY_SIGN } from '@config/constants';
import { useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { CreatePositionFormik } from '@modules/liquidity/types';
import { isExist, numberAsString, toAtomic, toReal } from '@shared/helpers';

import { calculateTick } from '../../helpers';
import {
  CreatePositionInput,
  CreatePositionAmountInput,
  CreatePositionPriceInput,
  isAmountInput
} from '../../types/create-position-form';
import { useOnAmountInputChange } from './use-on-amount-input-change';
import { useOnPriceRangeChange } from './use-on-price-range-change';
import { useOnPriceRangeInputChange } from './use-on-price-range-input-change';
import { useTickSpacing } from './use-tick-spacing';

export const useInputsHandlers = (
  formik: CreatePositionFormik,
  priceRangeDecimals: number,
  initialMinPrice: string,
  initialMaxPrice: string
) => {
  const { onAmountInputChange, lastEditedAmountFieldRef } = useOnAmountInputChange(formik);
  const priceDecimals = useV3PoolPriceDecimals();
  const tickSpacing = useTickSpacing();
  const onPriceRangeInputChange = useOnPriceRangeInputChange(formik, lastEditedAmountFieldRef);
  const onPriceRangeChange = useOnPriceRangeChange(formik, lastEditedAmountFieldRef);

  const handleRangeInputBlur = useCallback(
    (inputSlug: CreatePositionPriceInput) => () => {
      const inputValue = formik.values[inputSlug];

      if (!isExist(inputValue)) {
        return;
      }

      const realValue = new BigNumber(numberAsString(inputValue, priceRangeDecimals).realValue);
      const tick = realValue.isNaN() ? null : calculateTick(toAtomic(realValue, priceDecimals), tickSpacing);

      if (!formik.values[CreatePositionInput.FULL_RANGE_POSITION] && isExist(tick)) {
        onPriceRangeInputChange(
          inputSlug,
          toReal(tick.price, priceDecimals).decimalPlaces(priceRangeDecimals, BigNumber.ROUND_CEIL).toFixed()
        );
      }
    },
    [formik.values, onPriceRangeInputChange, priceDecimals, tickSpacing, priceRangeDecimals]
  );

  const handleInputChange = useCallback(
    (inputSlug: CreatePositionAmountInput | CreatePositionPriceInput, inputDecimals: number) => (value: string) => {
      const { realValue } = numberAsString(value, inputDecimals);
      if (isAmountInput(inputSlug)) {
        onAmountInputChange(inputSlug, realValue);
      } else {
        onPriceRangeInputChange(inputSlug, realValue);
      }
    },
    [onAmountInputChange, onPriceRangeInputChange]
  );

  const onFullRangeSwitcherClick = useCallback(
    (newState: boolean) => {
      formik.setFieldValue(CreatePositionInput.FULL_RANGE_POSITION, newState).then(() => {
        if (newState) {
          onPriceRangeChange(ZERO_AMOUNT.toString(), `+${INFINITY_SIGN}`);
        } else {
          onPriceRangeChange(initialMinPrice, initialMaxPrice);
        }
      });
    },
    [formik, initialMaxPrice, initialMinPrice, onPriceRangeChange]
  );

  return {
    handleRangeInputBlur,
    handleInputChange,
    onFullRangeSwitcherClick
  };
};
