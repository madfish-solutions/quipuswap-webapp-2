import { StakeStats } from '@api/staking/types';

const STALKING_API_URL = 'http://localhost:4444/stats';

export const getStakesStats = async (): Promise<StakeStats> => {
  const res = await fetch(`${STALKING_API_URL}`);

  return (await res.json()) as StakeStats;
};
