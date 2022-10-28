import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

const BASE = 1;
const BASE_BN = new BigNumber(BASE);

export const increaseBySlippage = (value: BigNumber, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.plus(slippagePercentage.dividedBy(PERCENTAGE_100));

  return value.multipliedBy(fixedSlippage);
};
