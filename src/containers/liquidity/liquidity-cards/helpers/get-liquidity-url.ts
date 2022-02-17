import { Nullable, RawToken } from '@interfaces/types';
import { getTokenPairSlug } from '@utils/helpers';

const LIQUIDITY_URL = '/liquidity';

export const getLiquidityUrl = (tabId: Nullable<string>, tokenA: Nullable<RawToken>, tokenB: Nullable<RawToken>) => {
  if (!tabId) {
    return LIQUIDITY_URL;
  }

  if (!tokenA || !tokenB) {
    return `${LIQUIDITY_URL}/${tabId}`;
  }

  return `${LIQUIDITY_URL}/${tabId}/${getTokenPairSlug(tokenA, tokenB)}`;
};
