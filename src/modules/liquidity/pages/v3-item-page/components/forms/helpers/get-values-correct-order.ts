import { FormikValues } from 'formik';

import { FIRST_INDEX } from '@config/constants';
import { isEqual } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { V3AddTokenInput } from '../interface';

const MAX_TOKENS_COUNT = 2;

export const getValuesCorrectOrder = (
  values: FormikValues,
  tokens: Array<Nullable<Token>>,
  tokenX: Nullable<Token>
) => {
  if (isEqual(tokens.length, MAX_TOKENS_COUNT) || isEqual(tokens[FIRST_INDEX], tokenX)) {
    return values;
  }

  return {
    [V3AddTokenInput.firstTokenInput]: values[V3AddTokenInput.secondTokenInput],
    [V3AddTokenInput.secondTokenInput]: values[V3AddTokenInput.firstTokenInput]
  } as FormikValues;
};
