import { LiquidityV3PositionWithStats } from '@modules/liquidity/types';
import { isGreaterThanZero } from '@shared/helpers';

export const getPositionsIdsWithFees = (positionsWithStats: LiquidityV3PositionWithStats[]) =>
  positionsWithStats
    .filter(({ stats }) => isGreaterThanZero(stats.tokenXFees) || isGreaterThanZero(stats.tokenYFees))
    .map(({ id }) => id);
