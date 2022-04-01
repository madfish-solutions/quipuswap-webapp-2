import { Nullable, Token } from '@shared/types';

export const getBlackListedTokens = (tokenA: Nullable<Token>, tokenB: Nullable<Token>) => [
  ...(tokenA ? [tokenA] : []),
  ...(tokenB ? [tokenB] : [])
];
