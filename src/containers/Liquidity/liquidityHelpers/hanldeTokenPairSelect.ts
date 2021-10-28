import { WhitelistedTokenPair } from '@utils/types';

export const hanldeTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  handleTokenChange: (arg: any) => void,
) => {
  handleTokenChange({ token: pair.token1, tokenNumber: 'first' });
  handleTokenChange({ token: pair.token2, tokenNumber: 'second' });
  setTokenPair(pair);
};
