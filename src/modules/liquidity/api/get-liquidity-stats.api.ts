import { LIQUIDITY_STATS_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

import { NewLiquidityStatsResponse } from '../types';

export const getLiquidityStatsApi = async () => await jsonFetch<NewLiquidityStatsResponse>(LIQUIDITY_STATS_API_URL);
