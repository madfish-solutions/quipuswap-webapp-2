import BigNumber from 'bignumber.js';
import { sqrtPriceForTick } from 'quipuswap-v3-sdk/dist/helpers/math';
import { Nat, Int } from 'quipuswap-v3-sdk/dist/types';

import { DEFAULT_TICK_SPACING, MAX_TICK_INDEX, MIN_TICK_INDEX, ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';

import { X80_FORMAT_PRECISION, X80_FORMAT_PRECISION_POWER } from './constants';

// TODO: remove this file as soon as quipuswap-v3-sdk is updated
function sqrtPriceForTickFailSafe(tick: number) {
  if (tick < MIN_TICK_INDEX) {
    return ZERO_AMOUNT_BN;
  }

  if (tick > MAX_TICK_INDEX) {
    return new BigNumber(Infinity);
  }

  return sqrtPriceForTick(new Int(tick)).toBignumber();
}

function alignToSpacing(tickIndex: Int, tickSpacing: number) {
  const floorIndex = new Int(
    tickIndex.toBignumber().dividedBy(tickSpacing).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(tickSpacing)
  );

  return floorIndex.lt(MIN_TICK_INDEX) ? floorIndex.plus(tickSpacing) : floorIndex;
}

/**
 * Calculates the index of the closest tick with the price below the specified one.
 * @param sqrtPrice Price square root in X80 format
 * @returns Tick index
 */
export function tickForSqrtPrice(sqrtPrice: Nat, tickSpacing = DEFAULT_TICK_SPACING): Int {
  const maxSqrtPrice = sqrtPriceForTickFailSafe(MAX_TICK_INDEX);

  if (sqrtPrice.gte(maxSqrtPrice)) {
    return alignToSpacing(new Int(MAX_TICK_INDEX), tickSpacing);
  }

  const minSqrtPrice = sqrtPriceForTickFailSafe(MIN_TICK_INDEX);

  if (sqrtPrice.lte(minSqrtPrice)) {
    return alignToSpacing(new Int(MIN_TICK_INDEX), tickSpacing);
  }

  const base = Math.E ** 0.0001;
  const maxRatio = Math.sqrt(base);

  const realPrice = sqrtPrice
    .shiftedBy(X80_FORMAT_PRECISION_POWER)
    .div(X80_FORMAT_PRECISION)
    .shiftedBy(-X80_FORMAT_PRECISION_POWER)
    .pow(2);
  let defaultSpacingTickIndex = Math.floor(Math.log(realPrice.toNumber()) / Math.log(base));
  let tickSqrtPrice = sqrtPriceForTickFailSafe(defaultSpacingTickIndex);
  let nextTickSqrtPrice = sqrtPriceForTickFailSafe(defaultSpacingTickIndex + 1);

  while (tickSqrtPrice.gt(sqrtPrice) || nextTickSqrtPrice.lte(sqrtPrice)) {
    const ratio = sqrtPrice
      .shiftedBy(X80_FORMAT_PRECISION_POWER)
      .div(tickSqrtPrice)
      .shiftedBy(-X80_FORMAT_PRECISION_POWER)
      .toNumber();
    const rawTickDelta = Math.log(ratio) / Math.log(maxRatio);
    const tickDelta = rawTickDelta < ZERO_AMOUNT ? Math.floor(rawTickDelta) : Math.ceil(rawTickDelta);
    if (!Number.isFinite(tickDelta)) {
      defaultSpacingTickIndex = tickDelta < ZERO_AMOUNT ? MIN_TICK_INDEX : MAX_TICK_INDEX;
    } else if (tickDelta === ZERO_AMOUNT) {
      break;
    } else {
      defaultSpacingTickIndex = defaultSpacingTickIndex + tickDelta;
    }
    tickSqrtPrice = sqrtPriceForTickFailSafe(defaultSpacingTickIndex);
    nextTickSqrtPrice = sqrtPriceForTickFailSafe(defaultSpacingTickIndex + 1);
  }

  return alignToSpacing(new Int(defaultSpacingTickIndex), tickSpacing);
}
