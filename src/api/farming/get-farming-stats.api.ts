import { FARMING_API_URL } from '@app.config';
import { FarmingStatsResponse } from '@interfaces/farming.interfaces';

const FARMING_STATS_API_URL = `${FARMING_API_URL}/stats`;

export const getFarmingStatsApi = async () => {
  const response = await fetch(FARMING_STATS_API_URL);
  const data = (await response.json()) as FarmingStatsResponse;

  return data.stats;
};
