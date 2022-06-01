import BigNumber from 'bignumber.js';

import { numberAsStringSchema } from '@shared/validators';

const ZERO = 0;

export const operationAmountSchema = (balance: Nullable<BigNumber>) =>
  balance
    ? numberAsStringSchema(
        { value: ZERO, isInclusive: false },
        { value: balance, isInclusive: true },
        'The value should be greater than zero.',
        `Max available value is ${balance.toNumber()}`
      )
    : numberAsStringSchema();
