import BigNumber from 'bignumber.js';

import { STABLESWAP_API_URL } from '@config/enviroment';
import { Nullable } from '@shared/types';

import { StableswapItemResponse } from '../types';

const STABLESWAP_LIST_API_URL = `${STABLESWAP_API_URL}/stableswap/list`;

export const getStableswapItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new Error('Failed to get nullable poolId');
  }

  const response = await fetch(`${STABLESWAP_LIST_API_URL}/${poolId.toFixed()}`);

  const data = (await response.json()) as StableswapItemResponse;

  return data.item;
};
