import BigNumber from 'bignumber.js';

import { BlockchainLiquidityV3Api } from '@modules/liquidity/api';
import { LiquidityV3Position, LiquidityV3Tick } from '@modules/liquidity/types';

function calculateFeeGrowthInside(
  poolStorage: BlockchainLiquidityV3Api.V3PoolStorage,
  lowerTick: LiquidityV3Tick,
  upperTick: LiquidityV3Tick
) {
  const feeAbove = poolStorage.cur_tick_index.gte(upperTick.id)
    ? {
        x: poolStorage.fee_growth.x.minus(upperTick.fee_growth_outside.x),
        y: poolStorage.fee_growth.y.minus(upperTick.fee_growth_outside.y)
      }
    : upperTick.fee_growth_outside;
  const feeBelow = poolStorage.cur_tick_index.gte(lowerTick.id)
    ? lowerTick.fee_growth_outside
    : {
        x: poolStorage.fee_growth.x.minus(lowerTick.fee_growth_outside.x),
        y: poolStorage.fee_growth.y.minus(lowerTick.fee_growth_outside.y)
      };

  return {
    x: poolStorage.fee_growth.x.minus(feeAbove.x).minus(feeBelow.x),
    y: poolStorage.fee_growth.y.minus(feeAbove.y).minus(feeBelow.y)
  };
}

const SHIFT_BY_128_BITS_DIVISOR = new BigNumber(2).pow(128);

export function calculateFees(poolStorage: BlockchainLiquidityV3Api.V3PoolStorage, position: LiquidityV3Position) {
  const feeGrowthInside = calculateFeeGrowthInside(poolStorage, position.lower_tick, position.upper_tick);

  return {
    x: feeGrowthInside.x
      .minus(position.fee_growth_inside_last.x)
      .multipliedBy(position.liquidity)
      .dividedToIntegerBy(SHIFT_BY_128_BITS_DIVISOR),
    y: feeGrowthInside.y
      .minus(position.fee_growth_inside_last.y)
      .multipliedBy(position.liquidity)
      .dividedToIntegerBy(SHIFT_BY_128_BITS_DIVISOR)
  };
}
