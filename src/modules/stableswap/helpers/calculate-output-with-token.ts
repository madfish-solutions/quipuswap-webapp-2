import BigNumber from 'bignumber.js';

export const calculateOutputWithToken = (lpValue: BigNumber, totalLpSupply: BigNumber, outReserve: BigNumber) =>
  lpValue.multipliedBy(outReserve).dividedBy(totalLpSupply);
