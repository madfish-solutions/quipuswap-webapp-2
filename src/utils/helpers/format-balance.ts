import BigNumber from 'bignumber.js';

import { FormatNumber } from '@utils/formatNumber';
import { bigNumberToString } from '@utils/helpers/big-number-to-string';

const FIRST_POSITION = 0;
const ONE_ELEMENT = 1;
const DEFAULT_BALANCE_LENGTH = 7;
const DEFAULT_NEGATIVE_BALANCE_LENGTH = 8;
const ZERO_STRING = '0';

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

export const formatBalance = (value: string): string => {
  const [integer, decimals] = value.split('.');

  const isNegative = Number(integer) < 0;
  const defaultBalanceLength = isNegative ? DEFAULT_NEGATIVE_BALANCE_LENGTH : DEFAULT_BALANCE_LENGTH;

  if (isZeroString(integer)) {
    const formattedDecimal = decimals ? formatDecimal(decimals) : null;

    if (formattedDecimal) {
      return value.slice(FIRST_POSITION, DEFAULT_BALANCE_LENGTH);
    }

    return ZERO_STRING;
  } else if (integer.length < defaultBalanceLength) {
    const decimals_ = decimals ? decimals.slice(FIRST_POSITION, defaultBalanceLength - integer.length) : ZERO_STRING;
    const formattedDecimal = formatDecimal(decimals_);

    return formattedDecimal ? `${FormatNumber(integer)}.${formattedDecimal}` : FormatNumber(integer);
  } else {
    return FormatNumber(integer);
  }
};

export const formatValueBalance = (value: BigNumber.Value) => formatBalance(bigNumberToString(new BigNumber(value)));
