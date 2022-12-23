import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

const BASE_BN = new BigNumber('1');

/**
 * Increase value by specified percentage
 * @param amount
 * @param percentage
 */
export const increaseByPercentage = (amount: BigNumber, percentage: BigNumber) => {
  const fixedPercentage = BASE_BN.plus(percentage.dividedBy(PERCENTAGE_100));

  return amount.multipliedBy(fixedPercentage);
};
