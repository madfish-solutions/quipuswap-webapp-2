import BigNumber from 'bignumber.js';

import { clamp } from './clamp';

export const getBaseLog = (base: number, value: number) => Math.log(value) / Math.log(base);

const INTEGER_CHORD_METHOD_EPSILON = 1;

/**
 * Implementation of chord method for integer values.
 * @param f monotonically non-decreasing function
 * @param x0 lower estimation of X
 * @param x1 upper estimation of X
 * @returns the integer value of X for which f(X) <= 0 and is closest to 0.
 */
export const integerChordMethod = (f: (x: BigNumber) => BigNumber, x0: BigNumber, x1: BigNumber): BigNumber => {
  const y0 = f(x0);
  const y1 = f(x1);

  if (y1.isZero()) {
    return x1;
  }

  if (x1.minus(x0).lte(INTEGER_CHORD_METHOD_EPSILON) || y0.isZero()) {
    return x0;
  }

  const x2 = clamp(
    x1.minus(y1.multipliedBy(x1.minus(x0)).dividedToIntegerBy(y1.minus(y0))),
    x0.plus(INTEGER_CHORD_METHOD_EPSILON),
    x1.minus(INTEGER_CHORD_METHOD_EPSILON)
  );
  const y2 = f(x2);

  if (y2.isZero()) {
    return x2;
  }

  return integerChordMethod(f, y2.isNegative() ? x2 : x0, y2.isNegative() ? x1 : x2);
};
