import BigNumber from 'bignumber.js';

export const calculateLpValue = (inputAmount: BigNumber, reserve: BigNumber, totalLpSupply: BigNumber): BigNumber =>
  inputAmount.multipliedBy(totalLpSupply).dividedBy(reserve);
