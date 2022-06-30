import BigNumber from 'bignumber.js';

import { PERCENTAGE_100 } from '@config/constants';

export const fractionToPercentage = (fraction: BigNumber) => fraction.times(PERCENTAGE_100);
