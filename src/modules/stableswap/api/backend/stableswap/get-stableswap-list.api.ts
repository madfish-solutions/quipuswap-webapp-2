import { STABLESWAP_LIST_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

import { StableswapListResponse } from '../../../types';

export const getStableswapListApi = async () => {
  const result = await jsonFetch<StableswapListResponse>(STABLESWAP_LIST_API_URL);

  return { list: result.list };
};
