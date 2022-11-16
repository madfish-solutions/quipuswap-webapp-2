import { BigNumber } from 'bignumber.js';

export const calculateInputWithFee = (inputAmount: BigNumber, feeRatio: BigNumber, devFeeRatio: BigNumber) =>
  inputAmount.multipliedBy(feeRatio).multipliedBy(devFeeRatio);
