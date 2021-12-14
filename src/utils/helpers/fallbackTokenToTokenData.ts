import { TokenDataType, WhitelistedToken } from '@utils/types';

export const fallbackTokenToTokenData = (token: WhitelistedToken): TokenDataType => ({
  token: {
    address: token.contractAddress,
    type: token.type,
    id: token.fa2TokenId,
    decimals: token.metadata.decimals
  },
  balance: '0'
});
