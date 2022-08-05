import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { StableswapStats } from '../types';

export class StableswapStatsDto implements StableswapStats {
  @Typed()
  totalTvlInUsd: BigNumber;
}
