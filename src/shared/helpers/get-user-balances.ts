import { useTokenBalance } from '@shared/hooks';
import { Nullable, Token } from '@shared/types';

export const getUserBalances = (tokens: Array<Nullable<Token>>) => {
  return tokens.map(token => useTokenBalance(token) ?? null);
};
