import BigNumber from 'bignumber.js';

export const toNat = (amount: string | number | BigNumber, decimals: number) =>
  new BigNumber(amount).times(10 ** decimals).integerValue(BigNumber.ROUND_DOWN);
