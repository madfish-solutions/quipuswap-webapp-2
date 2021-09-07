import { WhitelistedToken } from '@utils/types';

export const isTokenEqual = (
  a : WhitelistedToken,
  b : WhitelistedToken,
) => a.contractAddress === b.contractAddress
&& a.fa2TokenId === b.fa2TokenId;
