import BigNumber from 'bignumber.js';

import { STABLEFARM_LIST_API_URL } from '@config/constants';
import { Nullable } from '@shared/types';

import { StableFarmItemResponse } from '../types';

export const getStableFarmItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new Error('Failed to get nullable poolId');
  }

  const response = await fetch(`${STABLEFARM_LIST_API_URL}/${poolId.toFixed()}`);

  const data = (await response.json()) as StableFarmItemResponse;

  return data.item;
};
