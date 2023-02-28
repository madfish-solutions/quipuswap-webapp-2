import BigNumber from 'bignumber.js';

import { STABLEDIVIDENDS_LIST_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';
import { NoPoolIdError } from '@shared/errors';
import { Nullable } from '@shared/types';

import { StableDividendsItemResponse } from '../types';

export const getStableDividendsItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new NoPoolIdError();
  }

  const data = await jsonFetch<StableDividendsItemResponse>(`${STABLEDIVIDENDS_LIST_API_URL}/${poolId.toFixed()}`);

  return data.item;
};
