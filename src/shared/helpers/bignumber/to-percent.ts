import { BigNumber } from 'bignumber.js';

const FULL = 100;

export const toPercent = (value: BigNumber.Value): BigNumber => new BigNumber(value).div(new BigNumber(FULL));
