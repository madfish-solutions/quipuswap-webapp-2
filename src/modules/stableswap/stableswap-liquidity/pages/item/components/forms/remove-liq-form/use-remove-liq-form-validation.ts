import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';

import { getInputSlugByIndex } from '../../../../../../helpers';
import { LP_INPUT_KEY } from './constants';

export const useRemoveLiqFormValidation = (userLpBalance: BigNumber, userTokenBalance: Array<BigNumber>) => {
  return useMemo(() => {
    const inputAmountSchemas: Array<NumberAsStringSchema> = userTokenBalance.map(operationAmountSchema);
    const lpInputShema = operationAmountSchema(userLpBalance);

    const shapeMap: Array<[string, NumberAsStringSchema]> = inputAmountSchemas.map((item, index) => [
      getInputSlugByIndex(index),
      item.required('Value is required')
    ]);

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    return yup.object().shape({
      [LP_INPUT_KEY]: lpInputShema.required('Value is required'),
      ...shape
    });
  }, [userLpBalance, userTokenBalance]);
};
