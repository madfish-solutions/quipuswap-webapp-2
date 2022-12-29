import { BigNumber } from 'bignumber.js';
import { sqrtPriceForTick, liquidityDeltaToTokensDelta, tickForSqrtPrice } from 'quipuswap-v3-sdk/dist/helpers/math';
import { Nat, Int } from 'quipuswap-v3-sdk/dist/types';

import { DEFAULT_TICK_SPACING, MAX_TICK_INDEX, ZERO_AMOUNT_BN } from '@config/constants';
import { integerChordMethod, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { convertToAtomicPrice } from './convert-to-atomic-price';
import { convertToSqrtPrice } from './convert-to-sqrt-price';

export interface Tick {
  index: BigNumber;
  price: BigNumber;
}

interface TokensDelta {
  x: Nullable<BigNumber>;
  y: Nullable<BigNumber>;
}

export const calculateTickIndex = (atomicPrice: BigNumber, tickSpacing = DEFAULT_TICK_SPACING) => {
  return atomicPrice.isFinite()
    ? tickForSqrtPrice(new Nat(convertToSqrtPrice(atomicPrice)), new Nat(tickSpacing)).toBignumber()
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

const deltaIsLessOrEqual = (a: TokensDelta, b: TokensDelta) =>
  (!isExist(a.x) || !isExist(b.x) || a.x.lte(b.x)) && (!isExist(a.y) || !isExist(b.y) || a.y.lte(b.y));

export const calculateLiquidity = (
  currentTickIndex: BigNumber,
  lowerTickIndex: BigNumber,
  upperTickIndex: BigNumber,
  currentTickPrice: BigNumber,
  lowerTickPrice: BigNumber,
  upperTickPrice: BigNumber,
  xTokenAmount: Nullable<BigNumber>,
  yTokenAmount: Nullable<BigNumber>
) => {
  let analyticalEstimation: BigNumber;
  const xTokenAmountWithFallback = xTokenAmount ?? new BigNumber(Infinity);
  const yTokenAmountWithFallback = yTokenAmount ?? new BigNumber(Infinity);
  if (currentTickIndex.isLessThan(lowerTickIndex)) {
    analyticalEstimation = calculateUpperLiquidity(lowerTickPrice, upperTickPrice, xTokenAmountWithFallback);
  } else if (currentTickIndex.isGreaterThanOrEqualTo(upperTickIndex)) {
    analyticalEstimation = calculateLowerLiquidity(lowerTickPrice, upperTickPrice, yTokenAmountWithFallback);
  } else {
    analyticalEstimation = calculateMiddleLiquidity(
      currentTickPrice,
      lowerTickPrice,
      upperTickPrice,
      xTokenAmountWithFallback,
      yTokenAmountWithFallback
    );
  }
  const currentSqrtPrice = new Nat(convertToSqrtPrice(currentTickPrice));
  const calculateTokensDelta = (liquidity: BigNumber) =>
    liquidityDeltaToTokensDelta(
      new Int(liquidity),
      new Int(lowerTickIndex),
      new Int(upperTickIndex),
      new Int(currentTickIndex),
      currentSqrtPrice
    );

  const analyticalEstimationDelta = calculateTokensDelta(analyticalEstimation);
  const expectedTokensDelta = {
    x: xTokenAmount,
    y: yTokenAmount
  };

  const lowerEstimation = deltaIsLessOrEqual(analyticalEstimationDelta, expectedTokensDelta)
    ? analyticalEstimation
    : ZERO_AMOUNT_BN;
  const upperEstimation = deltaIsLessOrEqual(analyticalEstimationDelta, expectedTokensDelta)
    ? analyticalEstimation
        .multipliedBy(
          BigNumber.max(
            isExist(expectedTokensDelta.x) && !analyticalEstimationDelta.x.isZero()
              ? expectedTokensDelta.x.dividedBy(analyticalEstimationDelta.x)
              : ZERO_AMOUNT_BN,
            isExist(expectedTokensDelta.y) && !analyticalEstimationDelta.y.isZero()
              ? expectedTokensDelta.y.dividedBy(analyticalEstimationDelta.y)
              : ZERO_AMOUNT_BN
          ).plus(1)
        )
        .integerValue(BigNumber.ROUND_CEIL)
    : analyticalEstimation;

  const estimationByTokenX = isExist(expectedTokensDelta.x)
    ? integerChordMethod(
        liquidity => calculateTokensDelta(liquidity).x.minus(expectedTokensDelta.x!),
        lowerEstimation,
        upperEstimation
      )
    : Infinity;
  const estimationByTokenY = isExist(expectedTokensDelta.y)
    ? integerChordMethod(
        liquidity => calculateTokensDelta(liquidity).y.minus(expectedTokensDelta.y!),
        lowerEstimation,
        upperEstimation
      )
    : Infinity;

  return BigNumber.min(estimationByTokenX, estimationByTokenY);
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
