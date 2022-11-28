import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { FeeGrowthDto } from './fee-growth.dto';
import { TickDto } from './tick.dto';

export class LiquidityV3PositionDto {
  @Typed()
  id: BigNumber;

  @Typed({ type: FeeGrowthDto })
  fee_growth_inside_last: FeeGrowthDto;

  @Typed({ type: TickDto })
  lower_tick: TickDto;

  @Typed({ type: TickDto })
  upper_tick: TickDto;

  @Typed()
  owner: string;

  @Typed()
  liquidity: BigNumber;
}
