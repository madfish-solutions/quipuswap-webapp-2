import { BigNumber } from 'bignumber.js';

import { getBaseLog } from '@shared/helpers';

const TICK_BASE_POWER = 0.0001;
const TICK_BASE = Math.E ** TICK_BASE_POWER;

export const calculateTickIndex = (price: BigNumber): BigNumber =>
  new BigNumber(Math.floor(getBaseLog(TICK_BASE, price.toNumber())));

export const calculateTickPrice = (index: BigNumber): BigNumber => new BigNumber(Math.pow(TICK_BASE, index.toNumber()));

const calculateUpperLiquidity = (lowerTickPrice: BigNumber, upperTickPrice: BigNumber, xTokenAmount: BigNumber) =>
  xTokenAmount
    .multipliedBy(lowerTickPrice.sqrt())
    .multipliedBy(upperTickPrice.sqrt())
    .div(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));
const calculateLowerLiquidity = (lowerTickPrice: BigNumber, upperTickPrice: BigNumber, yTokenAmount: BigNumber) =>
  yTokenAmount.div(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));

const calculateMiddleLiquidity = (
  currentTickPrice: BigNumber,
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  xTokenAmount: BigNumber,
  yTokenAmount: BigNumber
) => {
  const liquidityUpper = calculateUpperLiquidity(currentTickPrice, upperTickPrice, xTokenAmount);
  const liquidityLower = calculateLowerLiquidity(lowerTickPrice, currentTickPrice, yTokenAmount);

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
    return calculateUpperLiquidity(lowerTickPrice, upperTickPrice, xTokenAmount);
  }

  if (currentTickIndex.isGreaterThanOrEqualTo(upperTickIndex)) {
    return calculateLowerLiquidity(lowerTickPrice, upperTickPrice, yTokenAmount);
  }

  return calculateMiddleLiquidity(currentTickPrice, lowerTickPrice, upperTickPrice, xTokenAmount, yTokenAmount);
};
