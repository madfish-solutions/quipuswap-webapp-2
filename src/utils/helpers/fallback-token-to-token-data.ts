import { TokenDataType, RawToken } from '@interfaces/types';

export const fallbackTokenToTokenData = (token: RawToken): TokenDataType => ({
  token: {
    address: token.contractAddress,
    type: token.type,
    id: token.fa2TokenId,
    decimals: token.metadata.decimals
  },
  balance: '0'
});
