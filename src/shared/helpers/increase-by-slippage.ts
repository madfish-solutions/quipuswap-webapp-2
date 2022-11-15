import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

const BASE_BN = new BigNumber('1');

/**
 * Increase value by slippage percentage
 * @param amount
 * @param slippagePercentage
 */
export const increaseBySlippage = (amount: BigNumber, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.plus(slippagePercentage.dividedBy(PERCENTAGE_100));

  return amount.multipliedBy(fixedSlippage);
};
