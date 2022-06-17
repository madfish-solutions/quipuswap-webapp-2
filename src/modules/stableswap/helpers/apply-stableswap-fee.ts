import { BigNumber } from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

export const apllyStableswapFee = (value: BigNumber, fees: Array<BigNumber>, increase = false) => {
  const totalFee = BigNumber.sum(...fees);

  if (increase) {
    value.multipliedBy(PERCENTAGE_100.plus(totalFee)).dividedBy(PERCENTAGE_100);
  }

  return value.multipliedBy(PERCENTAGE_100.minus(totalFee)).dividedBy(PERCENTAGE_100);
};
