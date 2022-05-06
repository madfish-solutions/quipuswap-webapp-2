import { FARMING_STATS_API_URL } from '@config/constants';

import { FarmingStatsResponse } from '../interfaces';

export const getFarmingStatsApi = async () => {
  const response = await fetch(FARMING_STATS_API_URL);
  const data = (await response.json()) as FarmingStatsResponse;

  return data.stats;
};
