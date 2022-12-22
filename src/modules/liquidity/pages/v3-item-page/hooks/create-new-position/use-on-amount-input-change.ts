import { useCallback, useRef } from 'react';

import BigNumber from 'bignumber.js';

import { CreatePositionFormik } from '@modules/liquidity/types';
import { isExist } from '@shared/helpers';

import {
  CreatePositionAmountInput,
  CreatePositionFormValues,
  CreatePositionInput
} from '../../types/create-position-form';
import { useCalculateInputAmountValue } from './use-calculate-input-amount-value';
import { useCurrentTick } from './use-current-tick';
import { usePositionTicks } from './use-position-ticks';

export const useOnAmountInputChange = (formik: CreatePositionFormik) => {
  const lastEditedAmountFieldRef = useRef<CreatePositionAmountInput | null>(null);
  const calculateInputAmountValue = useCalculateInputAmountValue();
  const { lowerTick, upperTick } = usePositionTicks(formik);
  const currentTick = useCurrentTick();

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
      if (canUpdateAnotherAmount) {
        const inputSlugToUpdate =
          inputSlug === CreatePositionInput.FIRST_AMOUNT_INPUT
            ? CreatePositionInput.SECOND_AMOUNT_INPUT
            : CreatePositionInput.FIRST_AMOUNT_INPUT;
        newValues[inputSlugToUpdate] = calculateInputAmountValue(
          inputSlug,
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
    [formik, lowerTick, upperTick, currentTick, calculateInputAmountValue]
  );

  return { lastEditedAmountFieldRef, onAmountInputChange };
};
