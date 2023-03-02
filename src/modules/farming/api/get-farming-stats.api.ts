import { FARMING_STATS_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

import { FarmingStatsResponse } from '../interfaces';

export const getFarmingStatsApi = async () => await jsonFetch<FarmingStatsResponse>(FARMING_STATS_API_URL);
