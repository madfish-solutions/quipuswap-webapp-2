import BigNumber from 'bignumber.js';

import { makeNumberAsStringTestFn, numberAsStringSchema } from '@shared/validators';

import { isExist } from './type-checks';

const ZERO = 0;

export const operationAmountSchema = (
  balance: Nullable<BigNumber>,
  isZeroInclusive = false,
  maxDecimals?: Nullable<number>,
  decimalsOverflowError?: string
) => {
  const baseSchema = balance
    ? numberAsStringSchema(
        { value: ZERO, isInclusive: isZeroInclusive },
        { value: balance, isInclusive: true },
        isZeroInclusive ? 'The value should be non-negative.' : 'The value should be greater than zero.',
        `Max available value is ${balance.toNumber()}`
      )
    : numberAsStringSchema();

  if (isExist(maxDecimals) && isExist(decimalsOverflowError)) {
    return baseSchema.test(
      'input-decimals-amount',
      () => decimalsOverflowError,
      makeNumberAsStringTestFn(value => value.decimalPlaces() <= maxDecimals)
    );
  }

  return baseSchema;
};
