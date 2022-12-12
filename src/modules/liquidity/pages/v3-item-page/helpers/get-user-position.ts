import { BigNumber } from 'bignumber.js';

import { LiquidityV3PositionWithStats } from '@modules/liquidity/types';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const getUserPosition = (
  positionsWithStats: Nullable<Array<LiquidityV3PositionWithStats>>,
  positionId: Nullable<BigNumber>
) => {
  if (isNull(positionsWithStats) || isNull(positionId)) {
    return null;
  }

  return positionsWithStats.find(position => position.id.isEqualTo(positionId)) ?? null;
};
