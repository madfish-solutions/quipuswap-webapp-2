import { LIQUIDITY_LIST_API_URL } from '@config/constants';

import { LiquidityItemResponse } from '../interfaces';

export const getNewLiquidityListApi = async (): Promise<{ list: Array<LiquidityItemResponse> }> => {
  const response = await fetch(LIQUIDITY_LIST_API_URL);

  return (await response.json()) as { list: Array<LiquidityItemResponse> };
};
