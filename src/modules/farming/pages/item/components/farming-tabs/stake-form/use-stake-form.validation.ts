import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { ActiveStatus, Nullable, Undefined } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators/balance-amount-schema';

import { StakeFormFields } from './stake-form.interface';
import { useFarmingStatusValidation } from './use-farming-status.validation';

export const useStakeFormValidation = (
  userBalance: Nullable<BigNumber>,
  canDelegate: boolean,
  farmStatus: Undefined<ActiveStatus>
) => {
  const farmStatusSchema = useFarmingStatusValidation(farmStatus);

  return useMemo(() => {
    const inputAmountSchema = balanceAmountSchema(userBalance);

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      [StakeFormFields.inputAmount]: inputAmountSchema.required('Value is required'),
      [StakeFormFields.selectedBaker]: bakerSchema,
      [StakeFormFields.farmStatus]: farmStatusSchema
    });
  }, [userBalance, canDelegate, farmStatusSchema]);
};
