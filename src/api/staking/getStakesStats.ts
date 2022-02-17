import { RawStakeStats } from '@interfaces/staking';

const STALKING_API_URL = 'http://localhost:4444/stats';

export const getStakesStats = async (): Promise<RawStakeStats> => {
  const res = await fetch(`${STALKING_API_URL}`);

  return (await res.json()) as RawStakeStats;
};
