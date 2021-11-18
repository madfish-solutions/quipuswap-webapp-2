import BigNumber from 'bignumber.js';

export const fromDecimals = (num: BigNumber, decimals: number) => num.div(
  new BigNumber(10).pow(decimals),
);
