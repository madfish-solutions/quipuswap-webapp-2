import { STABLEDIVIDENDS_STATS_API_URL } from '@config/constants';

import { StableDividendsStatsResponse } from '../types';

export const getStableDividendsStatsApi = async () => {
  const response = await fetch(STABLEDIVIDENDS_STATS_API_URL);
  const data = (await response.json()) as StableDividendsStatsResponse;

  const { stats } = data;

  return stats;
};
