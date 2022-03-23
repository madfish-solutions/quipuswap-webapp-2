import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { Undefined } from '@utils/types';

import { farmingOperationAmountSchema } from '../../../helpers';
import { StakeFormFields } from './stake-form.interface';
import { useFarmingStatusValidation } from './use-farming-status.validation';

export const useStakeFormValidation = (
  userBalance: Nullable<BigNumber>,
  canDelegate: boolean,
  farmingStatus: Undefined<ActiveStatus>
) => {
  const farmingStatusSchema = useFarmingStatusValidation(farmingStatus);

  return useMemo(() => {
    const inputAmountSchema = farmingOperationAmountSchema(userBalance);

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      [StakeFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakeFormFields.selectedBaker]: bakerSchema,
      [StakeFormFields.farmingStatus]: farmingStatusSchema
    });
  }, [userBalance, canDelegate, farmingStatusSchema]);
};
