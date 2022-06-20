import BigNumber from 'bignumber.js';

import { STABLEFARM_LIST_API_URL } from '@config/constants';
import { NoPoolIdError } from '@shared/errors';
import { Nullable } from '@shared/types';

import { StableFarmItemResponse } from '../types';

export const getStableFarmItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new NoPoolIdError();
  }

  const response = await fetch(`${STABLEFARM_LIST_API_URL}/${poolId.toFixed()}`);

  const data = (await response.json()) as StableFarmItemResponse;

  return data.item;
};
