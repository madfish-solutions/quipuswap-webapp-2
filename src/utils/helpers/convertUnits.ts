import BigNumber from 'bignumber.js';

export const convertUnits = (
  n: BigNumber, unit: number | BigNumber = 3,
) => (
  n.div(new BigNumber(10).pow(unit))
);
