import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { farmingOperationAmountSchema } from '../../../helpers';
import { UnstakeFormFields } from './unstake-form.interface';

export const useUnstakeFormValidation = (stakedBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = farmingOperationAmountSchema(stakedBalance);

    return yup.object().shape({
      [UnstakeFormFields.inputAmount]: inputAmountSchema.required('Value is required')
    });
  }, [stakedBalance]);
