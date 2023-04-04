import BigNumber from 'bignumber.js';

export const getInvertedValue = (value: BigNumber) => new BigNumber(1).dividedBy(value);
