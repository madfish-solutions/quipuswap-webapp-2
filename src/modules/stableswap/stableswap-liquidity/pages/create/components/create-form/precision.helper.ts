// 10^18 / 10^decimals == 10^(18-decimals)
import { BigNumber } from 'bignumber.js';

import { CONTRACT_DECIMALS_PRECISION_POWER } from '@config/constants';

export const getPrecisionMultiplier = (decimals: number) =>
  new BigNumber(10).pow(new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER).minus(decimals));

// 10^(18+18 - decimals)
export const getPrecisionRate = (decimals: number) =>
  new BigNumber(10).pow(
    new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER)
      .plus(new BigNumber(CONTRACT_DECIMALS_PRECISION_POWER))
      .minus(decimals)
  );
