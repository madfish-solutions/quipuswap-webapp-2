import { STALKING_API_URL } from '@app.config';
import { RawStakeStats } from '@interfaces/staking.interfaces';

const STALKING_STATS_API_URL = `${STALKING_API_URL}/stats`;

export const getStakingStatsApi = async () => {
  const res = await fetch(STALKING_STATS_API_URL);

  return (await res.json()) as RawStakeStats;
};
