import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { UnstakingFormFields } from './unstaking-form.interface';

const ZERO = 0;

export const useUnstakingFormValidation = (stakedBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = stakedBalance
      ? yup
          .number()
          .max(stakedBalance.toNumber(), `Max available value is ${stakedBalance.toNumber()}`)
          .moreThan(ZERO, 'The value should be greater than zero.')
      : yup.number();

    return yup.object().shape({
      [UnstakingFormFields.inputAmount]: inputAmountSchema.required('Value is required')
    });
  }, [stakedBalance]);
