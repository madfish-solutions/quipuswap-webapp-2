import { BigNumber } from 'bignumber.js';

export const getUserTokensAmountByShares = (atomicTokenTvl: BigNumber, shares: BigNumber, lpSupply: BigNumber) => {
  return atomicTokenTvl.multipliedBy(shares).dividedBy(lpSupply).integerValue(BigNumber.ROUND_DOWN);
};
