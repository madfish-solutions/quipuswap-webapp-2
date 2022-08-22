import { LiquidityTokenInfo } from '@modules/new-liquidity/interfaces';
import { useTokenBalance } from '@shared/hooks';

const ADD_LIQ_INPUT = 'add-liq-input';

export const getInputSlugByIndex = (index: number): string => `${ADD_LIQ_INPUT}-${index}`;

export const getUserBalances = (tokensInfo: Array<LiquidityTokenInfo>) => {
  return tokensInfo.map(({ token }) => useTokenBalance(token) ?? null);
};
