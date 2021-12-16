import BigNumber from 'bignumber.js';

import { DEFAULT_DECIMALS } from '@utils/defaults';

export interface FormatNumberOptinos {
  decimals?: number;
}

const STRING_ZERO = '0';

export const FormatInteger = (value: BigNumber.Value): string => {
  const integer = value.toString();

  const integerArray = integer.split('').reverse();

  const quantityOfComas = Math.floor((integer.length - 1) / 3);

  for (let i = quantityOfComas; i > 0; i--) {
    integerArray.splice(i * 3, 0, ',');
  }

  return integerArray.reverse().join('');
};

export const FormatNumber = (value: BigNumber.Value, options?: FormatNumberOptinos): string => {
  const decimals = options?.decimals ?? DEFAULT_DECIMALS;

  const [integer, decimal] = value.toString().split('.');

  if (integer === STRING_ZERO && !decimal) {
    return STRING_ZERO;
  }

  const newInteger = FormatInteger(integer);

  if (decimal) {
    const newDecimal = decimal.substring(0, decimals);

    return `${newInteger}.${newDecimal}`;
  }

  return newInteger;
};
