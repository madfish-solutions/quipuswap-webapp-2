import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { StakingFormFields } from './staking-form.interface';

const ZERO = 0;

export const useStakingFormValidation = (userBalance: Nullable<BigNumber>, canDelegate: boolean) =>
  useMemo(() => {
    const inputAmountSchema = userBalance
      ? yup
          .number()
          .max(userBalance.toNumber(), `Max available value is ${userBalance.toNumber()}`)
          .moreThan(ZERO, 'The value should be greater than zero.')
      : yup.number();

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      [StakingFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakingFormFields.selectedBaker]: bakerSchema
    });
  }, [userBalance, canDelegate]);
