import { TEZOS_TOKEN } from '@app.config';
import { Standard, Token as GraphQLToken } from '@graphql';
import { RawToken } from '@interfaces/types';

export const transformNodeToToken = (token?: GraphQLToken): RawToken => {
  if (!token) {
    return TEZOS_TOKEN;
  }

  return {
    contractAddress: token.id ?? '',
    type: Standard.Fa12,
    isWhitelisted: true,
    metadata: {
      decimals: 6,
      thumbnailUri: token.icon ?? '',
      name: token.symbol ?? '',
      symbol: token.symbol ?? ''
    }
  };
};
