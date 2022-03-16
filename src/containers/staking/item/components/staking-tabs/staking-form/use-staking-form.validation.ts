import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { Undefined } from '@utils/types';

import { stakingOperationAmountSchema } from '../../../helpers';
import { StakingFormFields } from './staking-form.interface';
import { useStakingStatusValidation } from './use-staking-status.validation';

export const useStakingFormValidation = (
  userBalance: Nullable<BigNumber>,
  canDelegate: boolean,
  stakingStatus: Undefined<ActiveStatus>
) => {
  const stakingStatusSchema = useStakingStatusValidation(stakingStatus);

  return useMemo(() => {
    const inputAmountSchema = stakingOperationAmountSchema(userBalance);

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      [StakingFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakingFormFields.selectedBaker]: bakerSchema,
      [StakingFormFields.stakingStatus]: stakingStatusSchema
    });
  }, [userBalance, canDelegate, stakingStatusSchema]);
};
