import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import { ZERO_AMOUNT } from '@config/constants';

export const isOneOfTheOutputNotZero = (values: FormikValues) => {
  const preparedOutputValues = Object.values(values).slice(1);

  return preparedOutputValues.some(value => new BigNumber(value).isGreaterThan(ZERO_AMOUNT));
};
