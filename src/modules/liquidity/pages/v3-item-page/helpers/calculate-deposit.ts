import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { BlockchainLiquidityV3Api } from '@modules/liquidity/api';
import { LiquidityV3PositionModel } from '@modules/liquidity/models';

import { X80_FORMAT_PRECISION } from './constants';

export const calculateDeposit = (
  position: LiquidityV3PositionModel,
  poolStorage: BlockchainLiquidityV3Api.V3PoolStorage
) => {
  const srpU = position.upper_tick.sqrt_price;
  const srpL = position.lower_tick.sqrt_price;
  const currentTickIndex = poolStorage.cur_tick_index;
  const lowerTickIndex = position.lower_tick.id;
  const upperTickIndex = position.upper_tick.id;

  if (currentTickIndex.lt(position.lower_tick.id)) {
    return {
      x: position.liquidity
        .times(srpU.minus(srpL).times(X80_FORMAT_PRECISION))
        .div(srpL.times(srpU))
        .integerValue(BigNumber.ROUND_FLOOR),
      y: ZERO_AMOUNT_BN
    };
  }

  if (lowerTickIndex.isLessThanOrEqualTo(currentTickIndex) && currentTickIndex.lt(upperTickIndex)) {
    return {
      x: position.liquidity
        .times(srpU.minus(poolStorage.sqrt_price).times(X80_FORMAT_PRECISION))
        .div(poolStorage.sqrt_price.times(srpU))
        .integerValue(BigNumber.ROUND_FLOOR),
      y: position.liquidity
        .times(poolStorage.sqrt_price.minus(srpL))
        .div(X80_FORMAT_PRECISION)
        .integerValue(BigNumber.ROUND_FLOOR)
    };
  }

  return {
    x: ZERO_AMOUNT_BN,
    y: position.liquidity.times(srpU.minus(srpL)).div(X80_FORMAT_PRECISION).integerValue(BigNumber.ROUND_FLOOR)
  };
};
