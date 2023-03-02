import { STABLEDIVIDENDS_STATS_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

import { StableDividendsStatsResponse } from '../types';

export const getStableDividendsStatsApi = async () => {
  const data = await jsonFetch<StableDividendsStatsResponse>(STABLEDIVIDENDS_STATS_API_URL);

  return data.stats;
};
