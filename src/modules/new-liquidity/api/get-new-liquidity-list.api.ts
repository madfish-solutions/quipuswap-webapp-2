import { LIQUIDITY_LIST_API_URL } from '@config/constants';

import { LiquidityItemWrap } from '../interfaces';

export const getNewLiquidityListApi = async (): Promise<{ list: Array<LiquidityItemWrap> }> => {
  const response = await fetch(LIQUIDITY_LIST_API_URL);

  const list = (await response.json()) as Array<LiquidityItemWrap>;

  return { list };
};
