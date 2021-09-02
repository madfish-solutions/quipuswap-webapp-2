import BigNumber from 'bignumber.js';

export const fromDecimals = (num:BigNumber, decimals: number) : BigNumber => num.div(
  new BigNumber(10)
    .pow(
      new BigNumber(decimals),
    ),
);
