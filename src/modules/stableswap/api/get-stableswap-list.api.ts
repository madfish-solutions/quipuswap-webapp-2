import { STABLESWAP_API_URL } from '@config/enviroment';

import { StableswapListResponse } from '../types';

const STABLESWAP_LIST_API_URL = `${STABLESWAP_API_URL}/stableswap/list`;

export const getStableswapListApi = async () => {
  const response = await fetch(STABLESWAP_LIST_API_URL);
  const data = (await response.json()) as StableswapListResponse;

  return data.list;
};
