import { BigNumber } from 'bignumber.js';

import { RoutePairWithDirection } from '../interface/route-pair-with-direction.interface';
import { getPairFeeRatio } from './fee.utils';

const util = (x: BigNumber, y: BigNumber): BigNumber[] => {
  const plus = x.plus(y);
  const minus = x.minus(y);

  return [
    plus.exponentiatedBy(8).minus(minus.exponentiatedBy(8)),
    minus.exponentiatedBy(7).plus(plus.exponentiatedBy(7)).multipliedBy(8)
  ];
};

type NewtonParam = { x: BigNumber; y: BigNumber; dx: BigNumber; dy: BigNumber; u: BigNumber; n: number };

const newton = (p: NewtonParam): BigNumber => {
  if (p.n === 0) {
    return p.dy;
  } else {
    const [new_u, new_du_dy] = util(p.x.plus(p.dx), p.y.minus(p.dy));

    //  new_u - p.u > 0 because dy remains an underestimate
    // dy is an underestimate because we start at 0 and the utility curve is convex
    p.dy = p.dy.plus(new_u.minus(p.u).dividedBy(new_du_dy));
    p.n -= 1;

    return newton(p);
  }
};

export const findFlatCfmmSwapOutput = (aTokenAmount: BigNumber, pair: RoutePairWithDirection) => {
  const feeRatio = getPairFeeRatio(pair);

  const aTokenMultiplier = pair.aTokenMultiplier ?? new BigNumber(1);
  const bTokenMultiplier = pair.bTokenMultiplier ?? new BigNumber(1);

  const x = pair.aTokenPool.multipliedBy(aTokenMultiplier);
  const y = pair.bTokenPool.multipliedBy(bTokenMultiplier);

  const [u] = util(x, y);

  const p: NewtonParam = {
    x: x,
    y: y,
    dx: aTokenAmount.multipliedBy(aTokenMultiplier),
    dy: new BigNumber(0),
    u: u,
    n: 5
  };

  return newton(p).multipliedBy(feeRatio).dividedToIntegerBy(bTokenMultiplier);
};

// TODO: find out formula that calculates Flat CFMM input amount based on output
// @ts-ignore
export const findFlatCfmmSwapInput = (bTokenAmount: BigNumber, pair: RoutePairWithDirection) => {
  return new BigNumber(Infinity);
};
