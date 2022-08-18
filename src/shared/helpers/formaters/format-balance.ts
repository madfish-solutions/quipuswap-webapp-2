import { BigNumber } from 'bignumber.js';

import { bigNumberToString } from '../bignumber';
import { FormatNumber } from './format-number';
import { shortNumberWithLetters } from './short-number-with-letters';

const FIRST_POSITION = 0;
const ONE_ELEMENT = 1;
export const DEFAULT_BALANCE_LENGTH = 7;
const DEFAULT_NEGATIVE_BALANCE_LENGTH = 8;
const ZERO_STRING = '0';
const MAX_AMOUNT_WITHOUT_LETTERS = 1e6; // 1M
const ZERO_STRING_LENGTH = 2;
const SIGN_PASS = 0;
const POINT = '.';

export const getLastElement = <T>(value: string | Array<T>) => value[value.length - ONE_ELEMENT];

const isZeroString = (value: string) => value === ZERO_STRING;

const formatDecimal = (decimals: string): string => {
  if (isZeroString(getLastElement(decimals))) {
    const decimals_ = decimals.slice(FIRST_POSITION, decimals.length - ONE_ELEMENT);

    return formatDecimal(decimals_);
  }

  return decimals;
};

const cleanUpZeros = (value: string) => {
  const preparedValue = formatDecimal(value);

  if (getLastElement(preparedValue) === POINT) {
    return ZERO_STRING;
  } else {
    return preparedValue;
  }
};

export const formatIntegerWithDecimals = (value: string) => {
  const [integer, decimals] = value.split(POINT);
  const formattedDecimals = decimals ? formatDecimal(decimals) : null;

  return formattedDecimals ? `${integer}.${formattedDecimals}` : integer;
};

export const formatBalance = (value: string, amountDecimals?: number): string => {
  const [integer, decimals] = value.split(POINT);

  const isNegative = Number(integer) < SIGN_PASS;
  const defaultBalanceLength = isNegative ? DEFAULT_NEGATIVE_BALANCE_LENGTH : DEFAULT_BALANCE_LENGTH;

  if (isZeroString(integer)) {
    if (decimals) {
      const decimalsLength = amountDecimals ?? DEFAULT_BALANCE_LENGTH;

      const preparedValue = value.slice(FIRST_POSITION, decimalsLength + ZERO_STRING_LENGTH);

      return cleanUpZeros(preparedValue);
    }

    return ZERO_STRING;
  } else if (integer.length < defaultBalanceLength) {
    const decimals_ = decimals
      ? decimals.slice(FIRST_POSITION, amountDecimals ?? defaultBalanceLength - integer.length)
      : ZERO_STRING;
    const formattedDecimal = formatDecimal(decimals_);

    return formattedDecimal ? `${FormatNumber(integer)}.${formattedDecimal}` : FormatNumber(integer);
  } else {
    return FormatNumber(integer);
  }
};

export const formatValueBalance = (
  amount: BigNumber.Value,
  amountDecimals?: number,
  maxAmountWithoutLetters = MAX_AMOUNT_WITHOUT_LETTERS
): string => {
  const bn = new BigNumber(amount);
  if (bn.gte(maxAmountWithoutLetters)) {
    return shortNumberWithLetters(amount, amountDecimals);
  }

  return formatBalance(bigNumberToString(new BigNumber(amount)), amountDecimals);
};
