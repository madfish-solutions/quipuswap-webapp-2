import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class StableswapDividendsStatsDto {
  @Typed({ type: BigNumber })
  totalTvlInUsd: BigNumber;
}
