import BigNumber from 'bignumber.js';

import { Undefined } from '@utils/types';

export function amountsAreEqual(amount1: Undefined<BigNumber>, amount2: Undefined<BigNumber>) {
  if (amount1 && amount2) {
    return amount1.eq(amount2);
  }

  return amount1 === amount2;
}
