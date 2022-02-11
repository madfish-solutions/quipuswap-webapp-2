import { Token } from '@utils/types';

export interface TokenPair {
  token1: Token;
  token2: Token;
}

// TODO: change type for the case one token is specified in URL
export interface TokenPairProviderValue {
  isPair: true;
  pair: TokenPair;
}
