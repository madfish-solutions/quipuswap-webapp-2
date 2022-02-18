import { STALKING_API_URL } from '@app.config';
import { RawStakeItem } from '@interfaces/staking';

const STALKING_LIST_API_URL = `${STALKING_API_URL}/list`;

export const getStakesList = async () => {
  const res = await fetch(STALKING_LIST_API_URL);

  return (await res.json()) as RawStakeItem[];
};
