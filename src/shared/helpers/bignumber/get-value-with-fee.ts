import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

export const getValueWithFee = (value: BigNumber, fee: number | string | BigNumber) => {
  return value.multipliedBy(PERCENTAGE_100.minus(fee)).dividedBy(PERCENTAGE_100);
};
