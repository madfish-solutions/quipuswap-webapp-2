import BigNumber from 'bignumber.js';

import { STABLESWAP_LIST_API_URL } from '@config/constants';
import { Nullable } from '@shared/types';

import { StableswapItemResponse } from '../types';

export const getStableswapItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new Error('Failed to get nullable poolId');
  }

  const response = await fetch(`${STABLESWAP_LIST_API_URL}/${poolId.toFixed()}`);

  const data = (await response.json()) as StableswapItemResponse;

  return data.item;
};
