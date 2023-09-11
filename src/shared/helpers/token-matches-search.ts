import { BigNumber } from 'bignumber.js';

import { includesCaseInsensitive } from './includes-case-insensitive';
import { isZeroTokenId } from './is-zero-token-id';
import { isExist } from './type-checks';
import { Nullable, Token } from '../types';

export const tokenMatchesSearch = (
  { metadata, contractAddress, fa2TokenId }: Token,
  search: string,
  tokenIdBn: Nullable<BigNumber>,
  contractOnly?: boolean
): boolean => {
  const tokenId = tokenIdBn?.toNumber();
  const isContract = contractAddress === search;

  if (isExist(tokenId) || contractOnly) {
    const fa2TokenIdMatches = (isZeroTokenId(tokenId) && isZeroTokenId(fa2TokenId)) || tokenId === fa2TokenId;

    return isContract && fa2TokenIdMatches;
  }

  const isName = includesCaseInsensitive(metadata?.name, search);
  const isSymbol = includesCaseInsensitive(metadata?.symbol, search);

  return isName || isSymbol || isContract;
};
