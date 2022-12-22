import { useCallback, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { isExist } from '@shared/helpers';

import {
  CreatePositionAmountInput,
  CreatePositionFormValues,
  CreatePositionInput
} from '../../types/create-position-form';
import { useCalculateInputAmountValues } from './use-calculate-input-amount-values';
import { usePositionTicks } from './use-position-ticks';

export const useOnAmountInputChange = (formik: ReturnType<typeof useFormik>) => {
  const lastEditedAmountFieldRef = useRef<CreatePositionAmountInput | null>(null);
  const { calculateFirstInputValue, calculateSecondInputValue } = useCalculateInputAmountValues();
  const { lowerTick, upperTick, currentTick } = usePositionTicks(formik);

  const onAmountInputChange = useCallback(
    (inputSlug: CreatePositionAmountInput, realValue: string) => {
      const newValues: Partial<CreatePositionFormValues> = {
        [inputSlug]: realValue
      };
      const newAmount = new BigNumber(realValue);
      const minPrice = new BigNumber(formik.values[CreatePositionInput.MIN_PRICE]);
      const maxPrice = new BigNumber(formik.values[CreatePositionInput.MAX_PRICE]);
      const canUpdateAnotherAmount =
        isExist(lowerTick) && isExist(upperTick) && isExist(currentTick) && minPrice.isLessThanOrEqualTo(maxPrice);
      if (inputSlug === CreatePositionInput.FIRST_AMOUNT_INPUT && canUpdateAnotherAmount) {
        newValues[CreatePositionInput.SECOND_AMOUNT_INPUT] = calculateSecondInputValue(
          currentTick,
          upperTick,
          lowerTick,
          newAmount
        );
      } else if (canUpdateAnotherAmount) {
        newValues[CreatePositionInput.FIRST_AMOUNT_INPUT] = calculateFirstInputValue(
          currentTick,
          upperTick,
          lowerTick,
          newAmount
        );
      }
      lastEditedAmountFieldRef.current = inputSlug;
      formik.setValues(prevValues => ({
        ...prevValues,
        ...newValues
      }));
    },
    [formik, lowerTick, upperTick, currentTick, calculateSecondInputValue, calculateFirstInputValue]
  );

  return { lastEditedAmountFieldRef, onAmountInputChange };
};
