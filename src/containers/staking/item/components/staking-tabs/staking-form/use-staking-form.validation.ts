import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { StakingFormFields } from './staking-form.interface';

export const useStakingFormValidation = (userBalance: Nullable<BigNumber>, canDelegate: boolean) =>
  useMemo(() => {
    const inputAmountSchema = userBalance
      ? yup.number().max(userBalance.toNumber(), `Max available value is ${userBalance.toNumber()}`)
      : yup.number();

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      [StakingFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakingFormFields.selectedBaker]: bakerSchema
    });
  }, [userBalance, canDelegate]);
