import { BigNumber } from 'bignumber.js';

import { RoutePairWithDirection } from '../interface/route-pair-with-direction.interface';
import { getPairFeeRatio } from './fee.utils';

export const findAmmSwapOutput = (aTokenAmount: BigNumber, pair: RoutePairWithDirection) => {
  const feeRatio = getPairFeeRatio(pair);

  const aTokenAmountWithFee = aTokenAmount.times(feeRatio);

  const numerator = aTokenAmountWithFee.times(pair.bTokenPool);
  const denominator = pair.aTokenPool.plus(aTokenAmountWithFee);

  return numerator.idiv(denominator);
};

export const findAmmSwapInput = (bTokenAmount: BigNumber, pair: RoutePairWithDirection) => {
  const feeRatio = getPairFeeRatio(pair);

  const numerator = pair.aTokenPool.times(bTokenAmount);
  const denominator = pair.bTokenPool.minus(bTokenAmount).times(feeRatio);

  const input = numerator.idiv(denominator).plus(1);

  return input.isGreaterThan(0) ? input : new BigNumber(Infinity);
};
