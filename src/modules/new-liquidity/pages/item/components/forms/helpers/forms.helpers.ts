import { LiquidityTokenInfo } from '@modules/new-liquidity/interfaces';
import { useTokenBalanceAutoLoading } from '@shared/hooks';

const LIQ_INPUT = 'liq-input';

export const getInputSlugByIndex = (index: number): string => `${LIQ_INPUT}-${index}`;

export const getUserBalances = (tokensInfo: Array<LiquidityTokenInfo>) => {
  return tokensInfo.map(({ token }) => useTokenBalanceAutoLoading(token) ?? null);
};
