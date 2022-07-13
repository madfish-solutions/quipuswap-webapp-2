import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { object } from 'yup';

import { Nullable } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators/balance-amount-schema';

import { FormFields } from '../types';

export const useFormValidation = (balance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = balanceAmountSchema(balance);

    return object().shape({
      [FormFields.inputAmount]: inputAmountSchema.required('Value is required')
    });
  }, [balance]);
