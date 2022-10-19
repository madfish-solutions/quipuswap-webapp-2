import { BigNumber } from 'bignumber.js';

import { Optional } from '../types';
import { numberAsStringSchema } from './number-as-string';

const ZERO = 0;

export const balanceAmountSchema = (balance: Optional<BigNumber>) =>
  balance
    ? numberAsStringSchema(
        { value: ZERO, isInclusive: false },
        { value: balance, isInclusive: true },
        'The value should be greater than zero.',
        `Max available value is ${balance.toNumber()}`
      )
    : numberAsStringSchema();
