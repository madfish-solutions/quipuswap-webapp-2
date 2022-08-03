import { STABLESWAP_LIST_API_URL } from '@config/constants';

import { StableswapListResponse } from '../types';

export const getStableswapListApi = async () => {
  const response = await fetch(STABLESWAP_LIST_API_URL);

  const result = (await response.json()) as StableswapListResponse;

  return { list: result.list };
};
