import BigNumber from 'bignumber.js';

const tickMultiplierLn = 0.0001;

export const calculateTickIndex = (price: BigNumber) =>
  new BigNumber(Math.log(price.toNumber()) / tickMultiplierLn).integerValue(BigNumber.ROUND_FLOOR);
