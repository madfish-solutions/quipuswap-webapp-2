import { getTokenPairSlug } from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

const LIQUIDITY_URL = '/liquidity';

export const getLiquidityUrl = (tabId: Nullable<string>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  if (!tabId) {
    return LIQUIDITY_URL;
  }

  if (!tokenA || !tokenB) {
    return `${LIQUIDITY_URL}/${tabId}`;
  }

  return `${LIQUIDITY_URL}/${tabId}/${getTokenPairSlug(tokenA, tokenB)}`;
};
