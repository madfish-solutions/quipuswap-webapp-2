import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { FarmingStats } from '../interfaces';

export class FarmingStatsDto implements FarmingStats {
  @Typed()
  totalValueLocked: BigNumber;

  @Typed()
  totalDailyReward: BigNumber;

  @Typed()
  totalPendingReward: BigNumber;

  @Typed()
  totalClaimedReward: BigNumber;
}
