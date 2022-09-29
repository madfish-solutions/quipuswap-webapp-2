import { LIQUIDITY_API_URL } from '@config/environment';

export const getDexTwoLiquidityItemApi = async (tokenPairSlug: string) => {
  if (!tokenPairSlug) {
    throw Error('tokenPairSlug is required');
  }

  return await fetch(`${LIQUIDITY_API_URL}/dex-two-item/${tokenPairSlug}`).then(async res => res.json());
};
