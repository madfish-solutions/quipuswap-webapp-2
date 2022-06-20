import { BigNumber } from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

export const apllyStableswapFee = (value: BigNumber, fees: Array<BigNumber>) => {
  const totalFee = BigNumber.sum(...fees);

  return value.multipliedBy(PERCENTAGE_100.minus(totalFee)).dividedBy(PERCENTAGE_100);
};
