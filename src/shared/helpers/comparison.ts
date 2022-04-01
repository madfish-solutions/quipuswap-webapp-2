import { BigNumber } from 'bignumber.js';

import { Undefined } from '@shared/types';

export const amountsAreEqual = (amount1: Undefined<BigNumber>, amount2: Undefined<BigNumber>) =>
  amount1 && amount2 ? amount1.eq(amount2) : amount1 === amount2;
