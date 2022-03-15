import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { StakingStatus } from '@interfaces/staking.interfaces';
import { Undefined } from '@utils/types';

import { StakingFormFields } from './staking-form.interface';
import { useStakingStatusValidation } from './use-staking-status.validation';

const ZERO = 0;

export const useStakingFormValidation = (
  userBalance: Nullable<BigNumber>,
  canDelegate: boolean,
  stakingStatus: Undefined<StakingStatus>
) => {
  const stakingStatusSchema = useStakingStatusValidation(stakingStatus);

  return useMemo(() => {
    const inputAmountSchema = userBalance
      ? yup
          .number()
          .max(userBalance.toNumber(), `Max available value is ${userBalance.toNumber()}`)
          .moreThan(ZERO, 'The value should be greater than zero.')
      : yup.number();

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      [StakingFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakingFormFields.selectedBaker]: bakerSchema,
      [StakingFormFields.stakingStatus]: stakingStatusSchema
    });
  }, [userBalance, canDelegate, stakingStatusSchema]);
};
