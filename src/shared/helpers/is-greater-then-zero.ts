import { BigNumber } from 'bignumber.js';

export const isGreaterThanZero = (value: BigNumber) => value.isGreaterThan('0');
