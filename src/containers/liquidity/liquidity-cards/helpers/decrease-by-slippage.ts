import BigNumber from 'bignumber.js';

const BASE = 1;
const BASE_BN = new BigNumber(BASE);
const PERCENTAGE = 100;
const PERCENTAGE_BN = new BigNumber(PERCENTAGE);

export const decreaseBySlippage = (value: BigNumber, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.minus(slippagePercentage.dividedBy(PERCENTAGE_BN));

  return value.multipliedBy(fixedSlippage);
};
