import BigNumber from 'bignumber.js';

import { FARMING_LIST_API_URL, FARMING_LIST_API_URL_V2 } from '@config/constants';
import { Nullable } from '@shared/types';

import { FarmingItemResponse } from '../interfaces';

export const getFarmingItemApi = async (farmingId: Nullable<BigNumber>, old = true) => {
  if (!farmingId) {
    throw new Error('Failed to get nullable farmingId');
  }

  const farmingItemUrl = old
    ? `${FARMING_LIST_API_URL}/${farmingId.toFixed()}`
    : `${FARMING_LIST_API_URL_V2}/${farmingId.toFixed()}`;

  const response = await fetch(farmingItemUrl);

  return (await response.json()) as FarmingItemResponse;
};
