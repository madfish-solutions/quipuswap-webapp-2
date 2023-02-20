import { useCallback, useRef } from 'react';

import BigNumber from 'bignumber.js';

import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { CreatePositionFormik } from '@modules/liquidity/types';
import { getInvertedValue, isExist, stringToBigNumber } from '@shared/helpers';
import { Nullable } from '@shared/types';

import {
  CreatePositionAmountInput,
  CreatePositionFormValues,
  CreatePositionInput
} from '../../types/create-position-form';
import { useCalculateInputAmountValue } from './use-calculate-input-amount-value';
import { useCurrentTick } from './use-current-tick';
import { usePositionTicks } from './use-position-ticks';

export const useOnAmountInputChange = (formik: CreatePositionFormik) => {
  const lastEditedAmountFieldRef = useRef<Nullable<CreatePositionAmountInput>>(null);
  const calculateInputAmountValue = useCalculateInputAmountValue();
  const { lowerTick, upperTick } = usePositionTicks(formik);
  const currentTick = useCurrentTick();
  const poolStore = useLiquidityV3PoolStore();

  const onAmountInputChange = useCallback(
    (inputSlug: CreatePositionAmountInput, realValue: string) => {
      const shouldShowTokenXToYPrice = poolStore.localShouldShowXToYPrice;
      const newValues: Partial<CreatePositionFormValues> = {
        [inputSlug]: realValue
      };
      const newAmount = new BigNumber(realValue);
      const displayedMinPrice = stringToBigNumber(formik.values[CreatePositionInput.MIN_PRICE]);
      const displayedMaxPrice = stringToBigNumber(formik.values[CreatePositionInput.MAX_PRICE]);
      const minPrice = shouldShowTokenXToYPrice ? getInvertedValue(displayedMaxPrice) : displayedMinPrice;
      const maxPrice = shouldShowTokenXToYPrice ? getInvertedValue(displayedMinPrice) : displayedMaxPrice;
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
    [poolStore, formik, lowerTick, upperTick, currentTick, calculateInputAmountValue]
  );

  return { lastEditedAmountFieldRef, onAmountInputChange };
};
