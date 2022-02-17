import { Nullable, RawToken } from '@interfaces/types';

export const getBlackListedTokens = (tokenA: Nullable<RawToken>, tokenB: Nullable<RawToken>) => [
  ...(tokenA ? [tokenA] : []),
  ...(tokenB ? [tokenB] : [])
];
