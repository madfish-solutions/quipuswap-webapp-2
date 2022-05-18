import { BigNumber } from 'bignumber.js';

import { Nullable } from '../types';
import { numberAsStringSchema } from './number-as-string';

const ZERO = 0;

export const balanceAmountSchema = (balance: Nullable<BigNumber>) =>
  balance
    ? numberAsStringSchema(
        { value: ZERO, isInclusive: false },
        { value: balance, isInclusive: true },
        'The value should be greater than zero.',
        `Max available value is ${balance.toNumber()}`
      )
    : numberAsStringSchema();
