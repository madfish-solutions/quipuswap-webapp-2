import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

const BASE_BN = new BigNumber('1');

export const decreaseByPercentage = (amount: BigNumber, percentage: BigNumber) => {
  const fixedPercentage = BASE_BN.minus(percentage.dividedBy(PERCENTAGE_100));

  return amount.multipliedBy(fixedPercentage);
};
