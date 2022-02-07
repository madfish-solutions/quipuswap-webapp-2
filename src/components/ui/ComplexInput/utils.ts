import { Nullable, Token } from '@utils/types';

export const getBlackListedTokens = (tokenA: Nullable<Token>, tokenB: Nullable<Token>) => [
  ...(tokenA ? [tokenA] : []),
  ...(tokenB ? [tokenB] : [])
];
