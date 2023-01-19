import { STABLEDIVIDENDS_NEW_LIST_API_URL } from '@config/constants';

import { StableDividendsListResponse } from '../types';

export const getStableDividendsListApi = async () => {
  const response = await fetch(STABLEDIVIDENDS_NEW_LIST_API_URL);
  const data = await response.json();

  //@ts-ignore
  return data.list.map(({ item }) => item) as StableDividendsListResponse['list'];
};
