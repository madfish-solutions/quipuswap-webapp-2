import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export const hanldeTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  handleTokenChange: (token: WhitelistedToken, tokenNum: 'first' | 'second') => void,
) => {
  handleTokenChange(pair.token1, 'first');
  handleTokenChange(pair.token2, 'second');
  setTokenPair(pair);
};
