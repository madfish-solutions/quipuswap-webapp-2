import { LIQUIDITY_DEX_TWO_ITEM_API_URL } from '@config/constants';

export const getV3LiquidityItemApi = async (address: string) => {
  if (!address) {
    throw Error('address is required');
  }

  const response = await fetch(`${LIQUIDITY_DEX_TWO_ITEM_API_URL}/${address}`);

  return await response.json();
};
