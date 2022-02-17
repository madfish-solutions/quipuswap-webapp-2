import { STALKING_API_URL } from '@app.config';
import { RawStakeStats } from '@interfaces/staking';

const STALKING_STATS_API_URL = `${STALKING_API_URL}/stats`;

export const getStakesStats = async () => {
  const res = await fetch(STALKING_STATS_API_URL);

  return (await res.json()) as RawStakeStats;
};
