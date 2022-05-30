import { BigNumber } from 'bignumber.js';

import { Optional } from '@shared/types';

import { isExist } from './type-checks';

export const amountsAreEqual = (amount1: Optional<BigNumber>, amount2: Optional<BigNumber>) =>
  amount1 && amount2 ? amount1.eq(amount2) : !isExist(amount1) && !isExist(amount2);
