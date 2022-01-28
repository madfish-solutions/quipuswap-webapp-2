import BigNumber from 'bignumber.js';

import { FormatNumber } from '@utils/formatNumber';
import { bigNumberToString } from '@utils/helpers/big-number-to-string';
import { Nullable } from '@utils/types';

const FIRST_POSITION = 0;
const ONE_ELEMENT = 1;
const DEFAULT_BALANCE_LENGTH = 7;
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
  const formatedDecimals = decimals ? formatDecimal(decimals) : null;

  return formatedDecimals ? `${integer}.${formatedDecimals}` : integer;
};

export const formatBalance = (value: string): string => {
  const [integer, decimals] = value.split('.');

  if (isZeroString(integer)) {
    return value.toString();
  } else if (integer.length < DEFAULT_BALANCE_LENGTH) {
    const decimals_ = decimals ? decimals.slice(FIRST_POSITION, DEFAULT_BALANCE_LENGTH - integer.length) : ZERO_STRING;
    const formatedDecimal = formatDecimal(decimals_);

    return formatedDecimal ? `${FormatNumber(integer)}.${formatedDecimal}` : FormatNumber(integer);
  } else {
    return FormatNumber(integer);
  }
};

export const formatValueBalance = (value: Nullable<BigNumber.Value>) =>
  value ? formatBalance(bigNumberToString(new BigNumber(value))) : '';
