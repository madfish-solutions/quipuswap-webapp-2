import { BigNumber } from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

export const calculateValueWithPercent = (value: BigNumber, percent: BigNumber) =>
  value.minus(value.dividedBy(PERCENTAGE_100).multipliedBy(percent));
