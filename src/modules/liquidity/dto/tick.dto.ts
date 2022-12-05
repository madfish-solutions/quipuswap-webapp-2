import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { FeeGrowthDto } from './fee-growth.dto';

export class TickDto {
  @Typed()
  id: BigNumber;

  @Typed({ type: FeeGrowthDto })
  fee_growth_outside: FeeGrowthDto;

  @Typed()
  liqudity_net: BigNumber;

  @Typed()
  n_positions: BigNumber;

  @Typed()
  next: BigNumber;

  @Typed()
  prev: BigNumber;

  @Typed()
  seconds_outside: BigNumber;

  @Typed()
  seconds_per_liquidity_outside: BigNumber;

  @Typed()
  sqrt_price: BigNumber;

  @Typed({ type: FeeGrowthDto })
  fee_growth: FeeGrowthDto;

  @Typed()
  tick_cumulative_outside: BigNumber;
}
