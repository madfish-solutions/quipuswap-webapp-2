import { LIQUIDITY_LIST_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

import { LiquidityItemResponse } from '../interfaces';

export const getLiquidityListApi = async () =>
  await jsonFetch<{ list: Array<LiquidityItemResponse> }>(LIQUIDITY_LIST_API_URL);
