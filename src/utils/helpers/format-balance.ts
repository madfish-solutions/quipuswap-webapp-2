import BigNumber from 'bignumber.js';

import { FormatNumber } from '@utils/formatNumber';
import { bigNumberToString } from '@utils/helpers/big-number-to-string';

import { shortNumberWithLetters } from './short-number-with-letters';

const FIRST_POSITION = 0;
const ONE_ELEMENT = 1;
export const DEFAULT_BALANCE_LENGTH = 7;
const DEFAULT_NEGATIVE_BALANCE_LENGTH = 8;
const ZERO_STRING = '0';
const MAX_AMOUNT_WITHOUT_LETTERS = 1e6; // 1M

const isZeroString = (value: string) => value === ZERO_STRING;

const formatDecimal = (decimals: string): string => {
  if (isZeroString(decimals[decimals.length - ONE_ELEMENT])) {
    const decimals_ = decimals.slice(FIRST_POSITION, decimals.length - ONE_ELEMENT);

    return formatDecimal(decimals_);
  }

  return decimals;
};

export const formatIntegerWithDecimals = (value: string) => {
  const [integer, decimals] = value.split('.');
  const formattedDecimals = decimals ? formatDecimal(decimals) : null;

  return formattedDecimals ? `${integer}.${formattedDecimals}` : integer;
};

export const formatBalance = (value: string, amountDecimals?: number): string => {
  const [integer, decimals] = value.split('.');

  const isNegative = Number(integer) < 0;
  const defaultBalanceLength = isNegative ? DEFAULT_NEGATIVE_BALANCE_LENGTH : DEFAULT_BALANCE_LENGTH;

  if (isZeroString(integer)) {
    const formattedDecimal = decimals ? formatDecimal(decimals) : null;

    if (formattedDecimal) {
      return value.slice(FIRST_POSITION, amountDecimals ?? DEFAULT_BALANCE_LENGTH);
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

export const formatValueBalance = (amount: BigNumber.Value, amountDecimals?: number): string => {
  const bn = new BigNumber(amount);
  if (bn.gte(MAX_AMOUNT_WITHOUT_LETTERS)) {
    return shortNumberWithLetters(amount, amountDecimals);
  }

  return formatBalance(bigNumberToString(new BigNumber(amount)), amountDecimals);
};
