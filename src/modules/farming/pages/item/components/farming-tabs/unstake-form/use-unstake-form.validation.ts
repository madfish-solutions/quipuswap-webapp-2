import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { object } from 'yup';

import { operationAmountSchema } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { UnstakeFormFields } from './unstake-form.interface';

export const useUnstakeFormValidation = (stakedBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = operationAmountSchema(stakedBalance);

    return object().shape({
      [UnstakeFormFields.inputAmount]: inputAmountSchema.required('Value is required')
    });
  }, [stakedBalance]);
