import { STABLEFARM_STATS_API_URL } from '@config/constants';

import { StableFarmStatsResponse } from '../types';

export const getStableFarmStatsApi = async () => {
  const response = await fetch(STABLEFARM_STATS_API_URL);
  const data = (await response.json()) as StableFarmStatsResponse;

  const { stats } = data;

  return stats;
};
