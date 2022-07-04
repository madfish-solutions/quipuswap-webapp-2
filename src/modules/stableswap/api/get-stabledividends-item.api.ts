import BigNumber from 'bignumber.js';

import { STABLEDIVIDENDS_LIST_API_URL } from '@config/constants';
import { NoPoolIdError } from '@shared/errors';
import { Nullable } from '@shared/types';

import { StableDividendsItemResponse } from '../types';

export const getStableDividendsItemApi = async (poolId: Nullable<BigNumber>) => {
  if (!poolId) {
    throw new NoPoolIdError();
  }

  const response = await fetch(`${STABLEDIVIDENDS_LIST_API_URL}/${poolId.toFixed()}`);

  const data = (await response.json()) as StableDividendsItemResponse;

  return data.item;
};
