import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { object } from 'yup';

import { Nullable } from '@shared/types';

import { operationAmountSchema } from '../../../helpers';
import { UnstakeFormFields } from './unstake-form.interface';

export const useUnstakeFormValidation = (stakedBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = operationAmountSchema(stakedBalance);

    return object().shape({
      [UnstakeFormFields.inputAmount]: inputAmountSchema.required('Value is required')
    });
  }, [stakedBalance]);
