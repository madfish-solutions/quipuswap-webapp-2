import { DEFAULT_DECIMALS } from '@utils/defaults';
import BigNumber from 'bignumber.js';

export interface FormatNumberOptinos {
  decimals?: number;
}

export const FormatInteger = (value: BigNumber.Value): string => {
  const integer = value.toString();

  const integerArray = integer.split('').reverse();

  const quantityOfComas = Math.floor((integer.length - 1) / 3);

  for (let i = quantityOfComas; i > 0; i--) {
    integerArray.splice(i * 3, 0, ',');
  }

  const newInteger = integerArray.reverse().join('');

  return newInteger;
};

export const FormatNumber = (
  value: BigNumber.Value,
  options?: FormatNumberOptinos
): string => {
  const decimals = options?.decimals ?? DEFAULT_DECIMALS;

  const [integer, decimal] = value.toString().split('.');

  const newInteger = FormatInteger(integer);

  if (decimal) {
    const newDecimal = decimal.substring(0, decimals);

    return `${newInteger}.${newDecimal}`;
  } else {
    return newInteger;
  }
};
