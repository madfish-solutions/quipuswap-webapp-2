import BigNumber from 'bignumber.js';
import { prettyPrice } from '.';

export const prettyPercentage = (percentage: BigNumber) => {
  const prettyPriceMaxValue = 999_999_999_999_999;

  if (percentage.gte(prettyPriceMaxValue)) {
    return Infinity;
  }

  return `${prettyPrice(percentage.toNumber(), 2)}%`;
};
