import BigNumber from 'bignumber.js';

const slippageToParseable = (str?: string) => (str ? str.split('%')[0].trim() : '0.5');

export const slippageToNum = (str?: string) => +slippageToParseable(str);

export const slippageToBignum = (
  percentage:string,
) => new BigNumber(slippageToParseable(percentage));
