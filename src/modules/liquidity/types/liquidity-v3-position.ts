import BigNumber from 'bignumber.js';

export interface FeeGrowth {
  x: BigNumber;
  y: BigNumber;
}

export interface LiquidityV3Tick {
  id: BigNumber;
  fee_growth_outside: FeeGrowth;
  liqudity_net: BigNumber;
  n_positions: BigNumber;
  next: BigNumber;
  prev: BigNumber;
  seconds_outside: BigNumber;
  seconds_per_liquidity_outside: BigNumber;
  sqrt_price: BigNumber;
  fee_growth: FeeGrowth;
  tick_cumulative_outside: BigNumber;
}

export interface LiquidityV3Position {
  id: BigNumber;
  fee_growth_inside_last: FeeGrowth;
  lower_tick: LiquidityV3Tick;
  upper_tick: LiquidityV3Tick;
  owner: string;
  liquidity: BigNumber;
}

export interface LiquidityV3PositionStats {
  collectedFeesUsd: BigNumber;
  depositUsd: BigNumber;
  minRange: BigNumber;
  maxRange: BigNumber;
  isInRange: boolean;
  tokenXDeposit: BigNumber;
  tokenYDeposit: BigNumber;
  tokenXFees: BigNumber;
  tokenYFees: BigNumber;
}

export interface LiquidityV3PositionWithStats extends LiquidityV3Position {
  stats: LiquidityV3PositionStats;
}
