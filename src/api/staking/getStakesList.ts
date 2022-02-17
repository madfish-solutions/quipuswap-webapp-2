import { RawStakeItem } from '@interfaces/staking';

const STALKING_API_URL = 'http://localhost:4444/list';

export const getStakesList = async (): Promise<RawStakeItem[]> => {
  const res = await fetch(`${STALKING_API_URL}`);

  return (await res.json()) as RawStakeItem[];
};
