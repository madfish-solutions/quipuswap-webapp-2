import { BigNumber } from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

export const getPercentageFromNumber = (amount: BigNumber, percent: BigNumber) =>
  amount.dividedBy(PERCENTAGE_100).multipliedBy(percent);
