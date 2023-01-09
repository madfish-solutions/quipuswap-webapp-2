import BigNumber from 'bignumber.js';

import { X80_FORMAT_PRECISION } from './constants';

export const convertToSqrtPrice = (atomicPrice: BigNumber) => {
  return atomicPrice.multipliedBy(X80_FORMAT_PRECISION.pow(2)).squareRoot().integerValue(BigNumber.ROUND_FLOOR);
};
