import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { StakingFormFields } from './staking-form.interface';

export const useStakingFormValidation = (userBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const inputAmountSchema = userBalance
      ? yup.number().max(userBalance.toNumber(), `Max available value is ${userBalance.toNumber()}`)
      : yup.number();

    return yup.object().shape({
      [StakingFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakingFormFields.selectedBaker]: yup.string().required('Baker is required')
    });
  }, [userBalance]);
