import { StakeItem } from '@api/staking/types';

const STALKING_API_URL = 'http://localhost:4444/list';

export const getStakesList = async (): Promise<StakeItem[]> => {
  try {
    const res = await fetch(`${STALKING_API_URL}`);

    return (await res.json()) as StakeItem[];
  } catch (error) {
    return Promise.reject(error);
  }
};
