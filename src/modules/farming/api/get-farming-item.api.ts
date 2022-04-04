import BigNumber from 'bignumber.js';

import { FARMING_API_URL } from '@config/enviroment';
import { Nullable } from '@shared/types';

import { FarmingItemResponse } from '../interfaces';

const FARMING_LIST_API_URL = `${FARMING_API_URL}/list`;

export const getFarmingItemApi = async (farmingId: Nullable<BigNumber>) => {
  if (!farmingId) {
    throw new Error('Failed to get nullable farmingId');
  }

  const response = await fetch(`${FARMING_LIST_API_URL}/${farmingId.toFixed()}`);

  const data = (await response.json()) as FarmingItemResponse;

  return data.item;
};
