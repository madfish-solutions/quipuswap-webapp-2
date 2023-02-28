import { LIQUIDITY_DEX_TWO_ITEM_API_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

export const getDexTwoLiquidityItemApi = async (tokenPairSlug: string) => {
  if (!tokenPairSlug) {
    throw Error('tokenPairSlug is required');
  }

  return await jsonFetch(`${LIQUIDITY_DEX_TWO_ITEM_API_URL}/${tokenPairSlug}`);
};
