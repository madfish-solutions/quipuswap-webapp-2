import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { stakingOperationAmountSchema } from '@containers/staking/item/helpers';

import { UnstakingFormFields } from './unstaking-form.interface';

export const useUnstakingFormValidation = (stakedBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = stakingOperationAmountSchema(stakedBalance);

    return yup.object().shape({
      [UnstakingFormFields.inputAmount]: inputAmountSchema.required('Value is required')
    });
  }, [stakedBalance]);
