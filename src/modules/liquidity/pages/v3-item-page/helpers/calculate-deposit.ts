import { ZERO_AMOUNT_BN } from '@config/constants';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { LiquidityV3Position } from '@modules/liquidity/types';
import { X80_FORMAT_PRECISION } from '@shared/helpers/dex/constants';

export const calculateDeposit = (position: LiquidityV3Position, poolStorage: V3LiquidityPoolApi.V3PoolStorage) => {
  const upperSqrtPrice = position.upper_tick.sqrt_price;
  const lowerSqrtPrice = position.lower_tick.sqrt_price;
  const currentTickIndex = poolStorage.cur_tick_index;
  const lowerTickIndex = position.lower_tick.id;
  const upperTickIndex = position.upper_tick.id;

  if (currentTickIndex.lt(lowerTickIndex)) {
    return {
      x: position.liquidity
        .times(upperSqrtPrice.minus(lowerSqrtPrice).times(X80_FORMAT_PRECISION))
        .dividedToIntegerBy(lowerSqrtPrice.times(upperSqrtPrice)),
      y: ZERO_AMOUNT_BN
    };
  }

  if (currentTickIndex.gte(upperTickIndex)) {
    return {
      x: ZERO_AMOUNT_BN,
      y: position.liquidity.times(upperSqrtPrice.minus(lowerSqrtPrice)).dividedToIntegerBy(X80_FORMAT_PRECISION)
    };
  }

  return {
    x: position.liquidity
      .times(upperSqrtPrice.minus(poolStorage.sqrt_price).times(X80_FORMAT_PRECISION))
      .dividedToIntegerBy(poolStorage.sqrt_price.times(upperSqrtPrice)),
    y: position.liquidity.times(poolStorage.sqrt_price.minus(lowerSqrtPrice)).dividedToIntegerBy(X80_FORMAT_PRECISION)
  };
};
