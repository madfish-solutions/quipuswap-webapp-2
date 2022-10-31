import { BigNumber } from 'bignumber.js';

export const getLpBasedOnToken = (amount: BigNumber, totalLpSupply: BigNumber, tokenAtomicTvl: BigNumber) => {
  return amount.multipliedBy(totalLpSupply).dividedBy(tokenAtomicTvl).integerValue(BigNumber.ROUND_DOWN);
};
