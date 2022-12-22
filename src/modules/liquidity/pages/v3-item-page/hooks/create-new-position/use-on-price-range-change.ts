import { MutableRefObject, useCallback } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { EMPTY_STRING } from '@config/constants';
import { useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { isExist, stringToBigNumber, toAtomic } from '@shared/helpers';

import { calculateTicks, shouldAddTokenX, shouldAddTokenY } from '../../helpers';
import {
  CreatePositionAmountInput,
  CreatePositionFormValues,
  CreatePositionInput
} from '../../types/create-position-form';
import { useCalculateInputAmountValues } from './use-calculate-input-amount-values';
import { usePositionTicks } from './use-position-ticks';

export const useOnPriceRangeChange = (
  formik: ReturnType<typeof useFormik>,
  lastEditedAmountFieldRef: MutableRefObject<CreatePositionAmountInput | null>
) => {
  const { calculateFirstInputValue, calculateSecondInputValue } = useCalculateInputAmountValues();
  const priceDecimals = useV3PoolPriceDecimals();
  const { currentTick, tickSpacing } = usePositionTicks(formik);

  return useCallback(
    (rawMinPrice: string, rawMaxPrice: string) => {
      const newValues: Partial<CreatePositionFormValues> = {
        [CreatePositionInput.MIN_PRICE]: rawMinPrice,
        [CreatePositionInput.MAX_PRICE]: rawMaxPrice
      };
      const newMinPrice = stringToBigNumber(rawMinPrice);
      const newMaxPrice = stringToBigNumber(rawMaxPrice);
      const { lowerTick, upperTick } = calculateTicks(
        toAtomic(newMinPrice, priceDecimals),
        toAtomic(newMaxPrice, priceDecimals),
        tickSpacing
      );
      const xTokenAmount = new BigNumber(formik.values[CreatePositionInput.FIRST_AMOUNT_INPUT]);
      const yTokenAmount = new BigNumber(formik.values[CreatePositionInput.SECOND_AMOUNT_INPUT]);
      const canUpdateAmounts =
        isExist(lowerTick) &&
        isExist(upperTick) &&
        isExist(currentTick) &&
        newMinPrice.isLessThanOrEqualTo(newMaxPrice);

      if (!canUpdateAmounts) {
        formik.setValues(prevValues => ({
          ...prevValues,
          ...newValues
        }));

        return;
      }

      if (
        lastEditedAmountFieldRef.current === CreatePositionInput.FIRST_AMOUNT_INPUT &&
        shouldAddTokenX(currentTick.index, upperTick.index)
      ) {
        newValues[CreatePositionInput.SECOND_AMOUNT_INPUT] = calculateSecondInputValue(
          currentTick,
          upperTick,
          lowerTick,
          xTokenAmount
        );
      } else if (
        lastEditedAmountFieldRef.current === CreatePositionInput.SECOND_AMOUNT_INPUT &&
        shouldAddTokenY(currentTick.index, lowerTick.index)
      ) {
        newValues[CreatePositionInput.FIRST_AMOUNT_INPUT] = calculateFirstInputValue(
          currentTick,
          upperTick,
          lowerTick,
          yTokenAmount
        );
      } else {
        newValues[CreatePositionInput.FIRST_AMOUNT_INPUT] = EMPTY_STRING;
        newValues[CreatePositionInput.SECOND_AMOUNT_INPUT] = EMPTY_STRING;
      }
      formik.setValues(prevValues => ({
        ...prevValues,
        ...newValues
      }));
    },
    [
      formik,
      priceDecimals,
      tickSpacing,
      currentTick,
      lastEditedAmountFieldRef,
      calculateSecondInputValue,
      calculateFirstInputValue
    ]
  );
};
