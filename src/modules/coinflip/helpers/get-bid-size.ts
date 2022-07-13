import { BigNumber } from 'bignumber.js';

import { Optional } from '@shared/types';

const PRECISION = 1e18;
const TOKEN_DECIMALS_PRECISION = new BigNumber(1e6);

export const getBidSize = (bank: Optional<BigNumber>, maxBetPercent: Optional<BigNumber>) => {
  if (!bank || !maxBetPercent) {
    return;
  }

  return bank.multipliedBy(maxBetPercent).div(PRECISION).div(TOKEN_DECIMALS_PRECISION);
};
