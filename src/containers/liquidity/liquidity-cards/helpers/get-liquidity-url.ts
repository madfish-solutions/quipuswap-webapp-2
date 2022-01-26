import { getTokenSlug } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

const LIQUIDITY_URL = '/liquidity';

export const getLiquidityUrl = (
  tabId: Nullable<string>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>
) => {
  if (!tabId) {
    return LIQUIDITY_URL;
  }

  if (!tokenA || !tokenB) {
    return `${LIQUIDITY_URL}/${tabId}`;
  }

  const from = getTokenSlug(tokenA);
  const to = getTokenSlug(tokenB);

  return `${LIQUIDITY_URL}/${tabId}/${from}-${to}`;
};
