import BigNumber from 'bignumber.js';

import { PERCENTAGE_100, ZERO_AMOUNT } from '@config/constants';

export const fractionToPercentage = (fraction: BigNumber) => fraction.times(PERCENTAGE_100);

export const getValueDiffPercentage = (value1: BigNumber, value2: BigNumber) => {
  if (value1.eq(ZERO_AMOUNT) && value2.eq(ZERO_AMOUNT)) {
    return new BigNumber(ZERO_AMOUNT);
  }

  return fractionToPercentage(new BigNumber(1).minus(value1.gt(value2) ? value2.div(value1) : value1.div(value2)));
};
