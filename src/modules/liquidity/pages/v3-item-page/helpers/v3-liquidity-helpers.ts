import { BigNumber } from 'bignumber.js';

import { DEFAULT_TICK_SPACING, MAX_TICK_INDEX, MIN_TICK_INDEX, ZERO_AMOUNT_BN } from '@config/constants';
import { clamp, getBaseLog } from '@shared/helpers';

const TICK_BASE_POWER = 0.0001;
const TICK_BASE = Math.E ** TICK_BASE_POWER;

export interface Tick {
  index: BigNumber;
  price: BigNumber;
}

export const calculateTickIndex = (price: BigNumber, tickSpacing = DEFAULT_TICK_SPACING): BigNumber => {
  const noLimitsIndex = new BigNumber(Math.floor(getBaseLog(TICK_BASE, price.toNumber())));

  return clamp(
    noLimitsIndex.dividedBy(tickSpacing).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(tickSpacing),
    MIN_TICK_INDEX,
    MAX_TICK_INDEX
  );
};

export const calculateTickPrice = (index: BigNumber): BigNumber => new BigNumber(Math.pow(TICK_BASE, index.toNumber()));

export const calculateUpperLiquidity = (
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  xTokenAmount: BigNumber
) =>
  xTokenAmount
    .multipliedBy(lowerTickPrice.sqrt())
    .multipliedBy(upperTickPrice.sqrt())
    .dividedToIntegerBy(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));
const calculateUpperXTokenAmount = (lowerTickPrice: BigNumber, upperTickPrice: BigNumber, liquidity: BigNumber) =>
  liquidity
    .multipliedBy(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()))
    .dividedToIntegerBy(lowerTickPrice.sqrt().times(upperTickPrice.sqrt()));

export const calculateLowerLiquidity = (
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  yTokenAmount: BigNumber
) => yTokenAmount.dividedToIntegerBy(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));
const calculateLowerYTokenAmount = (lowerTickPrice: BigNumber, upperTickPrice: BigNumber, liquidity: BigNumber) =>
  liquidity.multipliedBy(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));

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
  if (currentTickIndex.isLessThan(lowerTickIndex)) {
    return calculateUpperLiquidity(lowerTickPrice, upperTickPrice, xTokenAmount);
  }

  if (currentTickIndex.isGreaterThanOrEqualTo(upperTickIndex)) {
    return calculateLowerLiquidity(lowerTickPrice, upperTickPrice, yTokenAmount);
  }

  return calculateMiddleLiquidity(currentTickPrice, lowerTickPrice, upperTickPrice, xTokenAmount, yTokenAmount);
};

export const shouldAddTokenX = (currentTickIndex: BigNumber, upperTickIndex: BigNumber) =>
  currentTickIndex.isLessThan(upperTickIndex);

export const calculateXTokenAmount = (currentTick: Tick, lowerTick: Tick, upperTick: Tick, liquidity: BigNumber) => {
  if (currentTick.index.isLessThan(lowerTick.index)) {
    return calculateUpperXTokenAmount(lowerTick.price, upperTick.price, liquidity);
  }

  return shouldAddTokenX(currentTick.index, upperTick.index)
    ? calculateUpperXTokenAmount(currentTick.price, upperTick.price, liquidity)
    : ZERO_AMOUNT_BN;
};

export const shouldAddTokenY = (currentTickIndex: BigNumber, lowerTickIndex: BigNumber) =>
  currentTickIndex.isGreaterThanOrEqualTo(lowerTickIndex);

export const calculateYTokenAmount = (currentTick: Tick, lowerTick: Tick, upperTick: Tick, liquidity: BigNumber) => {
  if (upperTick.index.isLessThanOrEqualTo(currentTick.index)) {
    return calculateLowerYTokenAmount(lowerTick.price, upperTick.price, liquidity);
  }

  return shouldAddTokenY(currentTick.index, lowerTick.index)
    ? calculateLowerYTokenAmount(lowerTick.price, currentTick.price, liquidity)
    : ZERO_AMOUNT_BN;
};

export const calculateTick = (tickPrice: BigNumber, tickSpacing = DEFAULT_TICK_SPACING) => {
  const tickIndex = calculateTickIndex(tickPrice, tickSpacing);

  return { index: tickIndex, price: calculateTickPrice(tickIndex) };
};

export const fitUpperTick = (tick: Tick, lowerTickIndex: BigNumber, tickSpacing = DEFAULT_TICK_SPACING) => {
  const fittingTickIndex = BigNumber.maximum(tick.index, lowerTickIndex.plus(tickSpacing));

  return {
    index: fittingTickIndex,
    price: calculateTickPrice(fittingTickIndex)
  };
};
