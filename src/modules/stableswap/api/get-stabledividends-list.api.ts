import { STABLEDIVIDENDS_LIST_API_URL } from '@config/constants';

import { StableDividendsListResponse } from '../types';

export const getStableDividendsListApi = async () => {
  const response = await fetch(STABLEDIVIDENDS_LIST_API_URL);
  const data = (await response.json()) as StableDividendsListResponse;

  return data.list;
};
