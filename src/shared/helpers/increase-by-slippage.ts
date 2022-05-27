import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

const BASE_BN = new BigNumber('1');

export const increaseBySlippage = (amount: BigNumber, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.plus(slippagePercentage.dividedBy(PERCENTAGE_100));

  return amount.multipliedBy(fixedSlippage);
};
