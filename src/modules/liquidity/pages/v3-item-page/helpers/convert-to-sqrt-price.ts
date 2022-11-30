import BigNumber from 'bignumber.js';

import { X80_FORMAT_PRECISION } from './constants';

export const convertToSqrtPrice = (realPrice: BigNumber) => {
  return realPrice.squareRoot().multipliedBy(X80_FORMAT_PRECISION).integerValue(BigNumber.ROUND_FLOOR);
};
