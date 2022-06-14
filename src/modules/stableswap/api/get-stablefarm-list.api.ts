import { STABLEFARM_LIST_API_URL } from '@config/constants';

import { StableFarmListResponse } from '../types';

export const getStableFarmListApi = async () => {
  const response = await fetch(STABLEFARM_LIST_API_URL);
  const data = (await response.json()) as StableFarmListResponse;

  return data.list;
};
