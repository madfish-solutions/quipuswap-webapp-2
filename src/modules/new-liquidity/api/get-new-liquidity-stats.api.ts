import { LIQUIDITY_STATS_API_URL } from '@config/constants';

import { NewLiquidityStatsResponse } from '../types/api';

export const getNewLiquidityStatsApi = async () => {
  const response = await fetch(LIQUIDITY_STATS_API_URL);

  return (await response.json()) as NewLiquidityStatsResponse;
};
