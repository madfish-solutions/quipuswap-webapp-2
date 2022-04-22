import BigNumber from 'bignumber.js';

import { PERCENTAGE_BN } from '@config/constants';

const BASE = 1;
const BASE_BN = new BigNumber(BASE);

export const increaseBySlippage = (value: BigNumber, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.plus(slippagePercentage.dividedBy(PERCENTAGE_BN));

  return value.multipliedBy(fixedSlippage);
};
