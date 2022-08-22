import { LiquidityTokenInfo } from '@modules/new-liquidity/interfaces';
import { useTokenBalance } from '@shared/hooks';

const ADD_LIQ_INPUT = 'add-liq-input';
const REMOVE_LIQ_INPUT = 'remove-liq-input';

export const getInputSlugByIndexAdd = (index: number): string => `${ADD_LIQ_INPUT}-${index}`;
export const getInputSlugByIndexRemove = (index: number): string => `${REMOVE_LIQ_INPUT}-${index}`;

export const getUserBalances = (tokensInfo: Array<LiquidityTokenInfo>) => {
  return tokensInfo.map(({ token }) => useTokenBalance(token) ?? null);
};
