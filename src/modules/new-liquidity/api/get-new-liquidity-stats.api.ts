import { NEW_LIQUIDITY_STATS_API_URL } from '@config/constants';

import { NewLiquidityStatsResponse } from '../types/api';

export const getNewLiquidityStatsApi = async () => {
  const response = await fetch(NEW_LIQUIDITY_STATS_API_URL);

  const data = (await response.json()) as NewLiquidityStatsResponse;

  return data.stats;
};
