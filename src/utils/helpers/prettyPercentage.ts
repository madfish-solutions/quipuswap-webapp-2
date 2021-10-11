import BigNumber from 'bignumber.js';
import { prettyPrice } from '.';

export const prettyPercentage = (percentage: BigNumber) => {
  const oneTrillion = 1_000_000_000_000;

  if (percentage.gte(oneTrillion)) {
    return Infinity;
  }

  return `${prettyPrice(percentage.toNumber(), 2)}%`;
};
