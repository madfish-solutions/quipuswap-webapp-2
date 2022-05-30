/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import BigNumber from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';

import { saveBigNumber } from '../bignumber';
import { prepareNumberAsString } from '../prepare-number-as-string';
import { getLastChar, isEmptyString } from '../strings';

const SEPARATORS = ['.', ','];
const numbersRegExp = new RegExp('^[0-9]+$');

const cleanUpValue = (value: string) => {
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
  const cleanedValue = cleanUpValue(value);
  const preparedValue = prepareNumberAsString(cleanedValue);

  let fixedValue = new BigNumber(preparedValue).decimalPlaces(decimals, BigNumber.ROUND_DOWN);

  const lastChar = getLastChar(preparedValue);
  const [integer, decimals_] = preparedValue.split('.');
  const decimalsPart = decimals_?.slice(0, decimals) ?? '';

  const dec = decimalsPart && saveBigNumber(decimalsPart, new BigNumber(0)).isZero();

  let cleanValue;
  if (SEPARATORS.includes(lastChar)) {
    cleanValue = `${integer}${lastChar}`;
  } else if (dec) {
    const innerDecimalsPart =
      decimalsPart.length !== decimals ? decimalsPart : `${decimalsPart.slice(0, decimals - 1)}1`;
    cleanValue = `${integer}.${innerDecimalsPart}`;
    fixedValue = new BigNumber(cleanValue);
  } else {
    cleanValue = fixedValue.toFixed();
  }

  return {
    cleanValue,
    fixedValue
  };
};

export const numberAsString = (value: string, decimals: number) => {
  if (isEmptyString(value)) {
    return {
      realValue: EMPTY_STRING,
      fixedValue: null
    };
  }

  const { cleanValue, fixedValue } = fixValue(value, decimals);

  return {
    realValue: cleanValue,
    fixedValue
  };
};
