import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';

import { getInputSlugByIndex } from '../../../../../../helpers';

export const useAddLiqFormValidation = (userBalance: Array<BigNumber>) => {
  return useMemo(() => {
    const inputAmountSchemas: Array<NumberAsStringSchema> = userBalance.map(operationAmountSchema);

    const shapeMap: Array<[string, NumberAsStringSchema]> = inputAmountSchemas.map((item, index) => [
      getInputSlugByIndex(index),
      item.required('Value is required')
    ]);

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    return yup.object().shape(shape);
  }, [userBalance]);
};
