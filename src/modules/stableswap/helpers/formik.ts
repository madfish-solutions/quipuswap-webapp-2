import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import { isNull } from '@shared/helpers';

import { LP_INPUT_KEY } from '../stableswap-liquidity/pages/item/components/forms';
import { getInputSlugByIndex } from './get-input-slug-by-index';

const EMPTY_STRING = '';

const createFormikValues = (values: Array<string>): FormikValues => {
  const mapLikeFormikValues = values.map((value, index) => [getInputSlugByIndex(index), value]);

  return Object.fromEntries(mapLikeFormikValues);
};

export const getFormikInitialValues = (length: number) => {
  const filledArrayByEmptyStrings = new Array(length).fill(EMPTY_STRING);

  return createFormikValues(filledArrayByEmptyStrings);
};

export const getFormikInitialValuesRemoveForm = (length: number): FormikValues => {
  const values = getFormikInitialValues(length);

  values[LP_INPUT_KEY] = EMPTY_STRING;

  return values;
};

export const prepareFormikValue = (value: Nullable<BigNumber>) => (isNull(value) ? EMPTY_STRING : value.toFixed());
