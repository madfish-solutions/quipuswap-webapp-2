import { TokenAddress } from '@shared/types';

import { isExist } from '../type-checks';

const SEPARATOR = '_';

export const getTokenSlug = (token: TokenAddress) =>
  isExist(token.fa2TokenId) ? `${token.contractAddress}${SEPARATOR}${token.fa2TokenId}` : token.contractAddress;

export const getTokenAddress = (tokenSlug: string): TokenAddress => {
  const [contractAddress, fa2TokenId] = tokenSlug.split(SEPARATOR);

  return {
    contractAddress,
    fa2TokenId: isExist(fa2TokenId) ? Number(fa2TokenId) : undefined
  };
};
