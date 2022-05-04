import BigNumber from 'bignumber.js';

import { FARMING_LIST_API_URL } from '@config/constants';
import { Nullable } from '@shared/types';

import { FarmingItemResponse } from '../interfaces';

export const getFarmingItemApi = async (farmingId: Nullable<BigNumber>) => {
  if (!farmingId) {
    throw new Error('Failed to get nullable farmingId');
  }

  const response = await fetch(`${FARMING_LIST_API_URL}/${farmingId.toFixed()}`);

  const data = (await response.json()) as FarmingItemResponse;

  return data.item;
};
