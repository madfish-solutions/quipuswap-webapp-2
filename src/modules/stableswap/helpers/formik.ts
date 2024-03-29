import { FormikValues } from 'formik';

import { EMPTY_STRING, LP_INPUT_KEY } from '@config/constants';

import { getInputSlugByIndex } from './get-input-slug-by-index';

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
