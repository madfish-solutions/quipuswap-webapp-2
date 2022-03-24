import BigNumber from 'bignumber.js';

import { FARMING_API_URL } from '@app.config';
import { FarmingItemResponse } from '@interfaces/farming.interfaces';
import { Nullable } from '@utils/types';

const FARMING_LIST_API_URL = `${FARMING_API_URL}/list`;

export const getFarmingItemApi = async (farmingId: Nullable<BigNumber>) => {
  if (!farmingId) {
    throw new Error('Failed to get nullable farmingId');
  }

  const response = await fetch(`${FARMING_LIST_API_URL}/${farmingId.toFixed()}`);

  const data = (await response.json()) as FarmingItemResponse;

  return data.item;
};
