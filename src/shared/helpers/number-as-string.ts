/* eslint-disable @typescript-eslint/no-magic-numbers */
import BigNumber from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';

import { prepareNumberAsString } from './prepare-number-as-string';
import { getLastChar, isEmptyString } from './strings';

const SEPARATORS = ['.', ','];
const numbersRegExp = new RegExp('^[0-9]+$');

const cleanValue = (value: string) => {
  let hasSeparator = false;

  const newChars = [];

  for (const char of value) {
    if (!hasSeparator && SEPARATORS.includes(char)) {
      hasSeparator = true;

      newChars.push(char);
    } else if (numbersRegExp.test(char)) {
      newChars.push(char);
    }
  }

  return newChars.join('');
};

const fixValue = (value: string, decimals: number) => {
  const cleanedValue = cleanValue(value);
  const preparedValue = prepareNumberAsString(cleanedValue);

  return new BigNumber(preparedValue).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFixed();
};

export const numberAsString = (value: string, decimals: number) => {
  if (isEmptyString(value)) {
    return {
      realValue: EMPTY_STRING,
      fixedValue: EMPTY_STRING
    };
  }

  const lastChar = getLastChar(value);
  const fixedValue = fixValue(value, decimals);

  if (SEPARATORS.includes(lastChar)) {
    return {
      realValue: `${fixedValue}${lastChar}`,
      fixedValue
    };
  } else {
    return {
      realValue: fixedValue,
      fixedValue
    };
  }
};
