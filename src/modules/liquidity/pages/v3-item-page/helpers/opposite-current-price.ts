import BigNumber from 'bignumber.js';

export const oppositeCurrentPrice = (currentPrice: BigNumber) => new BigNumber(1).dividedBy(currentPrice);
