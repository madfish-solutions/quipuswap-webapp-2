import BigNumber from 'bignumber.js';

import { STABLESWAP_LIST_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';
import { NoPoolIdError } from '@shared/errors';
import { Nullable } from '@shared/types';

import { StableswapItemResponse } from '../types';

export const getStableswapItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new NoPoolIdError();
  }

  const data = await jsonFetch<StableswapItemResponse>(`${STABLESWAP_LIST_API_URL}/${poolId.toFixed()}`);

  //TODO: make model with blockInfo
  return data.item;
};
