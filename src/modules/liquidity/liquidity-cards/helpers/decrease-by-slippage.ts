import BigNumber from 'bignumber.js';

import { PERCENTAGE_BN } from '@config/constants';

const BASE = 1;
const BASE_BN = new BigNumber(BASE);

export const decreaseBySlippage = (value: BigNumber, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.minus(slippagePercentage.dividedBy(PERCENTAGE_BN));

  return value.multipliedBy(fixedSlippage);
};
