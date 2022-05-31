import { BigNumber } from 'bignumber.js';

import { MS_IN_MINUTES } from '@config/constants';

export const getStableswapDeadline = (transactionDuration: BigNumber) => {
  return new Date(transactionDuration.multipliedBy(MS_IN_MINUTES).plus(Date.now()).toNumber());
};
