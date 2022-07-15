import { BigNumber } from 'bignumber.js';

import { CONTRACT_DECIMALS_PRECISION, TOKEN_DECIMALS_PRECISION } from '@config/constants';
import { Optional } from '@shared/types';

const TOKEN_DECIMALS = new BigNumber(TOKEN_DECIMALS_PRECISION);

export const getBidSize = (bank: Optional<BigNumber>, maxBetPercent: Optional<BigNumber>) => {
  if (!bank || !maxBetPercent) {
    return;
  }

  return bank.multipliedBy(maxBetPercent).div(CONTRACT_DECIMALS_PRECISION).div(TOKEN_DECIMALS);
};
