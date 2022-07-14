import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN_DECIMALS_PRECISION } from '@config/tokens';
import { Optional } from '@shared/types';

const PRECISION = 1e18;
const TOKEN_DECIMALS_PRECISION = new BigNumber(DEFAULT_TOKEN_DECIMALS_PRECISION);

export const getBidSize = (bank: Optional<BigNumber>, maxBetPercent: Optional<BigNumber>) => {
  if (!bank || !maxBetPercent) {
    return;
  }

  return bank.multipliedBy(maxBetPercent).div(PRECISION).div(TOKEN_DECIMALS_PRECISION);
};
