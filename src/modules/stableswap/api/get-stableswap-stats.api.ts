import { STATS } from '@config/constants';
import { STABLESWAP_API_URL } from '@config/enviroment';

import { StableswapStatsResponse } from '../types';

const STABLESWAP_STATS_API_URL = `${STABLESWAP_API_URL}/${STATS}`;

export const getStableswapStatsApi = async () => {
  const response = await fetch(STABLESWAP_STATS_API_URL);
  const data = (await response.json()) as StableswapStatsResponse;

  return {
    //TODO: normal backend interface
    totalTvlInUsd: data.totalTvlInUsd
  };
};
