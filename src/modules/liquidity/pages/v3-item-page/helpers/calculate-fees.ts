import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { LiquidityV3Position, LiquidityV3Tick } from '@modules/liquidity/types';
import { shiftRightLogical } from '@shared/helpers';

const calculateFeeGrowthInside = (
  poolStorage: V3LiquidityPoolApi.V3PoolStorage,
  lowerTick: LiquidityV3Tick,
  upperTick: LiquidityV3Tick
) => {
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
};

const FEES_CALCULATION_SHIFT_BITS = 128;

export function calculateFees(poolStorage: V3LiquidityPoolApi.V3PoolStorage, position: LiquidityV3Position) {
  const feeGrowthInside = calculateFeeGrowthInside(poolStorage, position.lower_tick, position.upper_tick);

  return {
    x: shiftRightLogical(
      feeGrowthInside.x.minus(position.fee_growth_inside_last.x).multipliedBy(position.liquidity),
      FEES_CALCULATION_SHIFT_BITS
    ),
    y: shiftRightLogical(
      feeGrowthInside.y.minus(position.fee_growth_inside_last.y).multipliedBy(position.liquidity),
      FEES_CALCULATION_SHIFT_BITS
    )
  };
}
