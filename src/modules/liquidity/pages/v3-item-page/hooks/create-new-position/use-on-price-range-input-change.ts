import { MutableRefObject, useCallback } from 'react';

import { EMPTY_STRING } from '@config/constants';
import { CreatePositionFormik } from '@modules/liquidity/types';

import {
  CreatePositionAmountInput,
  CreatePositionInput,
  CreatePositionPriceInput
} from '../../types/create-position-form';
import { useOnPriceRangeChange } from './use-on-price-range-change';

export const useOnPriceRangeInputChange = (
  formik: CreatePositionFormik,
  lastEditedAmountFieldRef: MutableRefObject<CreatePositionAmountInput | null>
) => {
  const onPriceRangeChange = useOnPriceRangeChange(formik, lastEditedAmountFieldRef);

  return useCallback(
    (inputSlug: CreatePositionPriceInput, realValue: string) => {
      const newRawMinPrice =
        (inputSlug === CreatePositionInput.MIN_PRICE ? realValue : formik.values[CreatePositionInput.MIN_PRICE]) ??
        EMPTY_STRING;
      const newRawMaxPrice =
        (inputSlug === CreatePositionInput.MAX_PRICE ? realValue : formik.values[CreatePositionInput.MAX_PRICE]) ??
        EMPTY_STRING;
      onPriceRangeChange(newRawMinPrice, newRawMaxPrice);
    },
    [formik.values, onPriceRangeChange]
  );
};
