import { BigNumber } from 'bignumber.js';

import { LiquidityV3PositionWithStats } from '@modules/liquidity/types';
import { isEmptyArray, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const findUserPosition = (
  positionsWithStats: Array<LiquidityV3PositionWithStats>,
  positionId: Nullable<BigNumber.Value>
) => {
  if (isEmptyArray(positionsWithStats) || isNull(positionId)) {
    return null;
  }

  return positionsWithStats.find(position => position.id.isEqualTo(positionId)) ?? null;
};
