import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { object } from 'yup';

import { Nullable } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators/balance-amount-schema';

import { UnstakeFormFields } from './unstake-form.interface';

export const useUnstakeFormValidation = (stakedBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = balanceAmountSchema(stakedBalance);

    return object().shape({
      [UnstakeFormFields.inputAmount]: inputAmountSchema.required('Value is required')
    });
  }, [stakedBalance]);
