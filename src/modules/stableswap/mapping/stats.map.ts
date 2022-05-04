import { BigNumber } from 'bignumber.js';

import { RawStableswapStats, StableswapStats } from '../types';

export const statsMapper = (stats: RawStableswapStats): StableswapStats => ({
  totalTvlInUsd: new BigNumber(stats.totalTvlInUsd)
});
