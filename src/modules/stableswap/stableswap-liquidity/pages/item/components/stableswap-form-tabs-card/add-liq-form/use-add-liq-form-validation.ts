import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { operationAmountSchema } from '@modules/farming/pages/item/helpers';
import { NumberAsStringSchema } from '@shared/validators';

import { getInputSlugByIndex } from '../../../../../../helpers';

export const useAddLiqFormValidation = (userBalance: Array<BigNumber>) => {
  return useMemo(() => {
    const inputAmountSchemas = userBalance.map(operationAmountSchema);

    const shape: Record<string, NumberAsStringSchema> = {};

    let key = '';
    inputAmountSchemas.forEach((inputAmountSchema, index) => {
      key = getInputSlugByIndex(index);
      shape[key] = inputAmountSchema.required('Value is required');
    });

    return yup.object().shape(shape);
  }, [userBalance]);
};
