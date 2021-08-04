import BigNumber from 'bignumber.js';

const slippageToNum = (str?: string) => (str ? +str.split('%')[0].trim() : 0.5);

export const slippageToBignum = (
  percentage:string,
) => new BigNumber(slippageToNum(percentage) / 100);
