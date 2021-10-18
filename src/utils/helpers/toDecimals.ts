import BigNumber from 'bignumber.js';

export const toDecimals = (num:BigNumber, decimals: number) : BigNumber => num.times(
  new BigNumber(10)
    .pow(
      new BigNumber(decimals),
    ),
);
