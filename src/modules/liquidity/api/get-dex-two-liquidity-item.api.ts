import { LIQUIDITY_DEX_TWO_ITEM_API_URL } from '@config/constants';

export const getDexTwoLiquidityItemApi = async (tokenPairSlug: string) => {
  if (!tokenPairSlug) {
    throw Error('tokenPairSlug is required');
  }

  const response = await fetch(`${LIQUIDITY_DEX_TWO_ITEM_API_URL}/${tokenPairSlug}`);

  return await response.json();
};
