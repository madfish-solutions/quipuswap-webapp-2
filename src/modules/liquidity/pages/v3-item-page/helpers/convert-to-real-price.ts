import BigNumber from 'bignumber.js';

import { X80_FORMAT_PRECISION } from './constants';

export const convertToRealPrice = (sqrtPrice: BigNumber) => {
  return sqrtPrice.div(X80_FORMAT_PRECISION).pow(2);
};
