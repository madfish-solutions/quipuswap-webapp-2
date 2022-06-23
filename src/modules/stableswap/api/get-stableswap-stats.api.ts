import { STABLESWAP_STATS_API_URL } from '@config/constants';

import { StableswapStatsResponse } from '../types';

export const getStableswapStatsApi = async () => {
  const response = await fetch(STABLESWAP_STATS_API_URL);
  const data = (await response.json()) as StableswapStatsResponse;

  return data.stats;
};
