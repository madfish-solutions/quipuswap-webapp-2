import BigNumber from 'bignumber.js';

import { STABLESWAP_LIST_API_URL } from '@config/constants';
import { NoPoolIdError } from '@shared/errors';
import { Nullable } from '@shared/types';

import { StableswapItemResponse } from '../types';

export const getStableswapItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new NoPoolIdError();
  }

  const response = await fetch(`${STABLESWAP_LIST_API_URL}/${poolId.toFixed()}`);

  const data = (await response.json()) as StableswapItemResponse;

  return data.item;
};
