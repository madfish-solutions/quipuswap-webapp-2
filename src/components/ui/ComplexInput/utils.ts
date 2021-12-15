import { WhitelistedToken } from '@utils/types';

// eslint-disable-next-line max-len
export const getBlackListedTokens = (tokenA: WhitelistedToken | undefined, tokenB: WhitelistedToken | undefined) => [
  ...(tokenA ? [tokenA] : []),
  ...(tokenB ? [tokenB] : [])
];
