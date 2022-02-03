import { WhitelistedToken } from '@utils/types';

export const tokenDataToToken = (token: WhitelistedToken): WhitelistedToken =>
  ({
    contractAddress: token.contractAddress,
    fa2TokenId: token.fa2TokenId ?? undefined
  } as WhitelistedToken);
