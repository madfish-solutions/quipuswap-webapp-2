import BigNumber from 'bignumber.js';

import { FARMING_LIST_API_URL, FARMING_LIST_API_URL_V2, FARMING_LIST_API_URL_V3 } from '@config/constants';
import { Nullable } from '@shared/types';

import { FarmingItemResponse, FarmVersion } from '../interfaces';

const getUrl = (version: FarmVersion, old = true) => {
  if (old) {
    return FARMING_LIST_API_URL;
  }
  switch (version) {
    case FarmVersion.v1:
      return FARMING_LIST_API_URL;
    case FarmVersion.v2:
      return FARMING_LIST_API_URL_V2;
    case FarmVersion.v3:
      return FARMING_LIST_API_URL_V3;
    default:
      throw new Error(`Unknown farm version: ${version}`);
  }
};

export const getFarmingItemApi = async (farmingId: Nullable<BigNumber>, version: FarmVersion, old = true) => {
  if (!farmingId) {
    throw new Error('Failed to get nullable farmingId');
  }

  const response = await fetch(`${getUrl(version, old)}/${farmingId.toFixed()}`);

  return (await response.json()) as FarmingItemResponse;
};
