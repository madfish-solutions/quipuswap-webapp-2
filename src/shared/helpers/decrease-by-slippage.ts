import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

const BASE_BN = new BigNumber('1');

export const decreaseBySlippage = (amount: BigNumber, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.minus(slippagePercentage.dividedBy(PERCENTAGE_100));

  return amount.multipliedBy(fixedSlippage).integerValue(BigNumber.ROUND_DOWN);
};
