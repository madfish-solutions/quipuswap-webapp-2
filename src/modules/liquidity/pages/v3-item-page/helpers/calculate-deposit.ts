import { ZERO_AMOUNT_BN } from '@config/constants';
import { BlockchainLiquidityV3Api } from '@modules/liquidity/api';
import { LiquidityV3Position } from '@modules/liquidity/types';

import { X80_FORMAT_PRECISION } from './constants';

export const calculateDeposit = (
  position: LiquidityV3Position,
  poolStorage: BlockchainLiquidityV3Api.V3PoolStorage
) => {
  const upperSqrtPrice = position.upper_tick.sqrt_price;
  const lowerSqrtPrice = position.lower_tick.sqrt_price;
  const currentTickIndex = poolStorage.cur_tick_index;
  const lowerTickIndex = position.lower_tick.id;
  const upperTickIndex = position.upper_tick.id;

  if (currentTickIndex.lt(position.lower_tick.id)) {
    return {
      x: position.liquidity
        .times(upperSqrtPrice.minus(lowerSqrtPrice).times(X80_FORMAT_PRECISION))
        .dividedToIntegerBy(lowerSqrtPrice.times(upperSqrtPrice)),
      y: ZERO_AMOUNT_BN
    };
  }

  if (lowerTickIndex.isLessThanOrEqualTo(currentTickIndex) && currentTickIndex.lt(upperTickIndex)) {
    return {
      x: position.liquidity
        .times(upperSqrtPrice.minus(poolStorage.sqrt_price).times(X80_FORMAT_PRECISION))
        .dividedToIntegerBy(poolStorage.sqrt_price.times(upperSqrtPrice)),
      y: position.liquidity.times(poolStorage.sqrt_price.minus(lowerSqrtPrice)).dividedToIntegerBy(X80_FORMAT_PRECISION)
    };
  }

  return {
    x: ZERO_AMOUNT_BN,
    y: position.liquidity.times(upperSqrtPrice.minus(lowerSqrtPrice)).dividedToIntegerBy(X80_FORMAT_PRECISION)
  };
};
