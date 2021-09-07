import { TokenDataType, WhitelistedToken } from '@utils/types';

export const tokenDataToToken = (tokenData:TokenDataType) : WhitelistedToken => ({
  contractAddress: tokenData.token.address,
  fa2TokenId: tokenData.token.id ?? undefined,
} as WhitelistedToken);
