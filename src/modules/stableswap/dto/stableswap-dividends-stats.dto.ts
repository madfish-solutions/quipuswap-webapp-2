import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class StableswapDividendsStatsDto {
  @Typed()
  totalTvlInUsd: BigNumber;
}
