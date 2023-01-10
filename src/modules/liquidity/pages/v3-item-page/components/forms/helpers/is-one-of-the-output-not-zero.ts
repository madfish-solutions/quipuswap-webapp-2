import { FormikValues } from 'formik';

import { ZERO_AMOUNT } from '@config/constants';
import { isEqual } from '@shared/helpers';

const MAX_ZERO_INPUTS_AMOUNT = 1;

export const isOneOfTheOutputNotZero = (values: FormikValues) => {
  const amountOfZeroInputs = Object.values(values).filter(value => isEqual(Number(value), ZERO_AMOUNT)).length;

  return amountOfZeroInputs <= MAX_ZERO_INPUTS_AMOUNT;
};
