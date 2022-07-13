import BigNumber from 'bignumber.js';

export const amountGreaterThanValue = (amount: BigNumber, value: string) => amount.gt(new BigNumber(value));
