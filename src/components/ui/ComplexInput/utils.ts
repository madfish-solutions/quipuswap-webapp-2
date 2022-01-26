import { Nullable, WhitelistedToken } from '@utils/types';

export const getBlackListedTokens = (tokenA: Nullable<WhitelistedToken>, tokenB: Nullable<WhitelistedToken>) => [
  ...(tokenA ? [tokenA] : []),
  ...(tokenB ? [tokenB] : [])
];
