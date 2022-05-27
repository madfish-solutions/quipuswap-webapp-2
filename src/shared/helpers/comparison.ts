import { BigNumber } from 'bignumber.js';

import { Optional } from '@shared/types';

export const amountsAreEqual = (amount1: Optional<BigNumber>, amount2: Optional<BigNumber>) =>
  amount1 && amount2 ? amount1.eq(amount2) : amount1 === amount2;
