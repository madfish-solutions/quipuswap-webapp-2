import { STABLESWAP_STATS_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

import { StableswapStatsResponse } from '../types';

export const getStableswapStatsApi = async () => {
  const data = await jsonFetch<StableswapStatsResponse>(STABLESWAP_STATS_API_URL);

  return data.stats;
};
