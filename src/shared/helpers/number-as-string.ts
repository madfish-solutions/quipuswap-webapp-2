import BigNumber from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';

import { prepareNumberAsString } from './prepare-number-as-string';
import { getLastChar, isEmptyString } from './strings';

const SEPARATORS = ['.', ','];

export const numberAsString = (value: string, decimals: number) => {
  if (isEmptyString(value)) {
    return [EMPTY_STRING, EMPTY_STRING];
  }

  const lastChar = getLastChar(value);
  const preparedValue = prepareNumberAsString(value);
  const fixedValue = new BigNumber(preparedValue).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFixed();

  if (SEPARATORS.includes(lastChar)) {
    return [fixedValue, `${fixedValue}${lastChar}`];
  } else {
    return [fixedValue, fixedValue];
  }
};
