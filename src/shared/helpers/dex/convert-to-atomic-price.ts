import BigNumber from 'bignumber.js';

import { X80_FORMAT_PRECISION, X80_FORMAT_PRECISION_POWER } from './constants';

export const convertToAtomicPrice = (sqrtPrice: BigNumber) => {
  const defaultDecimalPlaces = BigNumber.config().DECIMAL_PLACES;
  BigNumber.config({ DECIMAL_PLACES: X80_FORMAT_PRECISION_POWER });
  const price = new BigNumber(sqrtPrice).div(X80_FORMAT_PRECISION).pow(2);
  BigNumber.config({ DECIMAL_PLACES: defaultDecimalPlaces });

  return price;
};
