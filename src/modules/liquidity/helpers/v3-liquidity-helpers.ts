import { BigNumber } from 'bignumber.js';

import { getBaseLog } from '@shared/helpers';

const TICK_BASE = 1.0001;

export const calculateTickIndex = (price: BigNumber): BigNumber =>
  new BigNumber(Math.floor(getBaseLog(TICK_BASE, price.toNumber())));

export const calculateTickPrice = (index: BigNumber): BigNumber => new BigNumber(Math.pow(TICK_BASE, index.toNumber()));

const calculateLowerLiquidity = (lowerTickPrice: BigNumber, upperTickPrice: BigNumber, xTokenAmount: BigNumber) =>
  xTokenAmount
    .multipliedBy(lowerTickPrice.sqrt())
    .multipliedBy(upperTickPrice.sqrt())
    .div(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));
const calculateUpperLiquidity = (lowerTickPrice: BigNumber, upperTickPrice: BigNumber, yTokenAmount: BigNumber) =>
  yTokenAmount.div(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));

const calculateMiddleLiquidity = (
  currentTickPrice: BigNumber,
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  xTokenAmount: BigNumber,
  yTokenAmount: BigNumber
) => {
  const liquidityLower = calculateLowerLiquidity(currentTickPrice, upperTickPrice, xTokenAmount);
  const liquidityUpper = calculateUpperLiquidity(lowerTickPrice, currentTickPrice, yTokenAmount);

  return BigNumber.min(liquidityLower, liquidityUpper);
};

export const calculateLiquidity = (
  currentTickIndex: BigNumber,
  lowerTickIndex: BigNumber,
  upperTickIndex: BigNumber,
  currentTickPrice: BigNumber,
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  xTokenAmount: BigNumber,
  yTokenAmount: BigNumber
) => {
  if (currentTickIndex.isLessThanOrEqualTo(lowerTickIndex)) {
    return calculateLowerLiquidity(lowerTickPrice, upperTickPrice, xTokenAmount);
  }

  if (currentTickIndex.isGreaterThanOrEqualTo(upperTickIndex)) {
    return calculateUpperLiquidity(lowerTickPrice, upperTickPrice, yTokenAmount);
  }

  return calculateMiddleLiquidity(currentTickPrice, lowerTickPrice, upperTickPrice, xTokenAmount, yTokenAmount);
};
