import { LIQUIDITY_STATS_API_URL } from '@config/constants';

import { NewLiquidityStatsResponse } from '../types';

export const getLiquidityStatsApi = async () => {
  const response = await fetch(LIQUIDITY_STATS_API_URL);

  return (await response.json()) as NewLiquidityStatsResponse;
};
