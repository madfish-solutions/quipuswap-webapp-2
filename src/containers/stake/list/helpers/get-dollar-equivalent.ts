import BigNumber from 'bignumber.js';

export const getDollarEquivalent = (value: string, exhangeRate: string) =>
  new BigNumber(value).times(exhangeRate).toFixed();
