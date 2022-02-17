import { TokenDataType, Token } from '@utils/types';

export const fallbackTokenToTokenData = (token: Token): TokenDataType => ({
  token: {
    address: token.contractAddress,
    type: token.type,
    id: token.fa2TokenId,
    decimals: token.metadata.decimals
  },
  balance: '0'
});
