import { BlockInfoWrap } from '@shared/types';

export interface NewLiquidityStatsResponse extends IRawNewLiquidityStats, BlockInfoWrap {}

export interface IRawNewLiquidityStats {
  stats: RawNewLiquidityStats;
}

export interface RawNewLiquidityStats {
  totalValueLocked: string;
  maxApr: string;
  poolsCount: string;
}
