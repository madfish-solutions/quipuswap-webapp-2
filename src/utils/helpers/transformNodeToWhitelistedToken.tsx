import { TEZOS_TOKEN } from '@app.config';
import { Token } from '@graphql';
import { WhitelistedToken } from '@utils/types';

export const transformNodeToWhitelistedToken = (token?: Token): WhitelistedToken => {
  if (!token) {
    return TEZOS_TOKEN;
  }

  return {
    contractAddress: token.id ?? '',
    type: 'fa1.2',
    metadata: {
      decimals: 6,
      thumbnailUri: token.icon ?? '',
      name: token.symbol ?? '',
      symbol: token.symbol ?? ''
    }
  };
};
