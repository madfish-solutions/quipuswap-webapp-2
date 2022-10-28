import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

export const getValueWithFee = (value: BigNumber, fee: BigNumber.Value) => {
  const percentFee = new BigNumber(fee).multipliedBy(PERCENTAGE_100);

  return value.multipliedBy(PERCENTAGE_100.minus(percentFee)).dividedBy(PERCENTAGE_100);
};
