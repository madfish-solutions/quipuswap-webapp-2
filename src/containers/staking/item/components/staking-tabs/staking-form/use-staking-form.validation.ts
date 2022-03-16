import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { stakingOperationAmountSchema } from '@containers/staking/item/helpers';

import { StakingFormFields } from './staking-form.interface';

export const useStakingFormValidation = (userBalance: Nullable<BigNumber>, canDelegate: boolean) =>
  useMemo(() => {
    const inputAmountSchema = stakingOperationAmountSchema(userBalance);

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      [StakingFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakingFormFields.selectedBaker]: bakerSchema
    });
  }, [userBalance, canDelegate]);
