import { BigNumber } from 'bignumber.js';

const FULL = 100;

export const toFraction = (percentage: BigNumber.Value): BigNumber =>
  new BigNumber(percentage).div(new BigNumber(FULL));
