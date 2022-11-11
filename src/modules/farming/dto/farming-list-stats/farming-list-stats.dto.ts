import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { FarmingStats } from '../../interfaces';

export class FarmingListStatsDto implements FarmingStats {
  @Typed()
  totalValueLocked: BigNumber;

  @Typed()
  totalDailyReward: BigNumber;

  @Typed()
  totalPendingReward: BigNumber;

  @Typed()
  maxApr: BigNumber;
}
