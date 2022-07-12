import { BigNumber } from 'bignumber.js';

const PRECISION = 1e18;
const TOKEN_DECIMALS_PRECISION = 1e6;

export const getBidSize = (bank: Nullable<BigNumber> | undefined, maxBetPercent: Nullable<BigNumber> | undefined) => {
  if (!bank || !maxBetPercent) {
    return;
  }

  return bank.multipliedBy(maxBetPercent).div(PRECISION).div(new BigNumber(TOKEN_DECIMALS_PRECISION));
};
