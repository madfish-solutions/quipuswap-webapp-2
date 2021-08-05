import { WhitelistedToken } from '@utils/types';

export const isTokensEqual = (
  a: WhitelistedToken,
  b: WhitelistedToken,
) : boolean => a.contractAddress === b.contractAddress && a.fa2TokenId === b.fa2TokenId;
