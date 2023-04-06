import { STABLEDIVIDENDS_NEW_LIST_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

import { StableDividendsListResponse } from '../../../types';

export const getStableDividendsListApi = async () => {
  const data = await jsonFetch<StableDividendsListResponse>(STABLEDIVIDENDS_NEW_LIST_API_URL);

  //@ts-ignore
  return data.list.map(({ item }) => item) as StableDividendsListResponse['list'];
};
