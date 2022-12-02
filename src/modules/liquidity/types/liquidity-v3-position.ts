import BigNumber from 'bignumber.js';

export interface FeeGrowth {
  x: BigNumber;
  y: BigNumber;
}

export interface Tick {
  id: BigNumber;
  fee_growth_outside: FeeGrowth;
  liqudity_net: BigNumber;
  n_positions: BigNumber;
  next: BigNumber;
  prev: BigNumber;
  seconds_outside: BigNumber;
  seconds_per_liquidity_outside: BigNumber;
  sqrt_price: BigNumber;
  tick_cumulative_outside: BigNumber;
}

export interface LiquidityV3Position {
  id: BigNumber;
  fee_growth_inside_last: FeeGrowth;
  lower_tick: Tick;
  upper_tick: Tick;
  owner: string;
  liquidity: BigNumber;
}
