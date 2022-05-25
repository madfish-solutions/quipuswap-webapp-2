import { BigNumber } from 'bignumber.js';

import { MS_IN_SECOND, SECONDS_IN_MINUTE } from '@config/constants';

const MS_IN_MINUTES = MS_IN_SECOND * SECONDS_IN_MINUTE;

export const getStableswapDeadline = (transactionDuration: BigNumber) => {
  return new Date(transactionDuration.multipliedBy(MS_IN_MINUTES).plus(Date.now()).toNumber());
};
