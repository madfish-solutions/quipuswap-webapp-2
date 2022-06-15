import BigNumber from 'bignumber.js';

import { numberAsStringSchema } from '@shared/validators';

const ZERO = 0;

export const operationAmountSchema = (balance: Nullable<BigNumber>, isZeroInclusive = false) =>
  balance
    ? numberAsStringSchema(
        { value: ZERO, isInclusive: isZeroInclusive },
        { value: balance, isInclusive: true },
        isZeroInclusive ? 'The value should be non-negative.' : 'The value should be greater than zero.',
        `Max available value is ${balance.toNumber()}`
      )
    : numberAsStringSchema();
