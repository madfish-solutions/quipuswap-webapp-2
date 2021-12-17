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

  const from = tokenA.contractAddress + (tokenA.type === 'fa1.2' ? '' : `_${tokenA.fa2TokenId}`);
  const to = tokenB.contractAddress + (tokenB.type === 'fa1.2' ? '' : `_${tokenB.fa2TokenId}`);

  return `${LIQUIDITY_URL}/${tabId}/${from}-${to}`;
};
