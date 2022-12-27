import { BigNumber } from 'bignumber.js';
import { sqrtPriceForTick, liquidityDeltaToTokensDelta } from 'quipuswap-v3-sdk/dist/helpers/math';
import { Nat, Int } from 'quipuswap-v3-sdk/dist/types';

import { DEFAULT_TICK_SPACING, MAX_TICK_INDEX } from '@config/constants';

import { convertToAtomicPrice } from './convert-to-atomic-price';
import { convertToSqrtPrice } from './convert-to-sqrt-price';
import { tickForSqrtPrice } from './tick-for-sqrt-price';

export interface Tick {
  index: BigNumber;
  price: BigNumber;
}

export const calculateTickIndex = (atomicPrice: BigNumber, tickSpacing = DEFAULT_TICK_SPACING) => {
  return atomicPrice.isFinite()
    ? tickForSqrtPrice(new Nat(convertToSqrtPrice(atomicPrice)), tickSpacing).toBignumber()
    : new BigNumber(MAX_TICK_INDEX);
};

export const calculateTickPrice = (index: BigNumber) => convertToAtomicPrice(sqrtPriceForTick(new Int(index)));

export const calculateUpperLiquidity = (
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  xTokenAmount: BigNumber
) =>
  xTokenAmount
    .multipliedBy(lowerTickPrice.sqrt())
    .multipliedBy(upperTickPrice.sqrt())
    .dividedToIntegerBy(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));

export const calculateLowerLiquidity = (
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  yTokenAmount: BigNumber
) => yTokenAmount.dividedToIntegerBy(upperTickPrice.sqrt().minus(lowerTickPrice.sqrt()));

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

const calculateTokensAmount = (currentTick: Tick, lowerTick: Tick, upperTick: Tick, liquidity: BigNumber) =>
  liquidityDeltaToTokensDelta(
    new Int(liquidity),
    new Int(lowerTick.index),
    new Int(upperTick.index),
    new Int(currentTick.index),
    new Nat(convertToSqrtPrice(currentTick.price))
  );

export const calculateXTokenAmount = (currentTick: Tick, lowerTick: Tick, upperTick: Tick, liquidity: BigNumber) =>
  calculateTokensAmount(currentTick, lowerTick, upperTick, liquidity).x.toBignumber();

export const shouldAddTokenY = (currentTickIndex: BigNumber, lowerTickIndex: BigNumber) =>
  currentTickIndex.isGreaterThanOrEqualTo(lowerTickIndex);

export const calculateYTokenAmount = (currentTick: Tick, lowerTick: Tick, upperTick: Tick, liquidity: BigNumber) =>
  calculateTokensAmount(currentTick, lowerTick, upperTick, liquidity).y.toBignumber();

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
