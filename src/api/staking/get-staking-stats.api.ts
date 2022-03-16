import { STALKING_API_URL } from '@app.config';
import { StakeStatsResponse } from '@interfaces/staking.interfaces';

const STALKING_STATS_API_URL = `${STALKING_API_URL}/stats`;

export const getStakingStatsApi = async () => {
  const response = await fetch(STALKING_STATS_API_URL);
  const data = (await response.json()) as StakeStatsResponse;

  return data.stats;
};
