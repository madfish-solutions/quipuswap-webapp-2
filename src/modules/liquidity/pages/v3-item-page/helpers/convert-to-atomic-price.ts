import BigNumber from 'bignumber.js';

import { X80_FORMAT_PRECISION } from './constants';

export const convertToAtomicPrice = (sqrtPrice: BigNumber) => {
  const decimalShiftAmount = X80_FORMAT_PRECISION.precision();

  return sqrtPrice.shiftedBy(decimalShiftAmount).div(X80_FORMAT_PRECISION).shiftedBy(-decimalShiftAmount).pow(2);
};
