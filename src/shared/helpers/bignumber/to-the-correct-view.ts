import { BigNumber } from 'bignumber.js';

export const toTheCorrectView = (number: BigNumber, decimals: number | BigNumber): BigNumber => number.div(decimals);
