import BigNumber from 'bignumber.js';

const EXPONENT_ERROR = 100;

export const fixBakerFee = (fee: number) => new BigNumber(fee).times(EXPONENT_ERROR).toFixed(2);
