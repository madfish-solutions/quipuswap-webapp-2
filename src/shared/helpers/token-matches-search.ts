import { BigNumber } from 'bignumber.js';

import { Nullable, Token } from '../types';
import { includesCaseInsensitive } from './includes-case-insensitive';
import { isZeroTokenId } from './is-zero-token-id';
import { isExist } from './type-checks';

export const tokenMatchesSearch = (
  { metadata, contractAddress, fa2TokenId }: Token,
  search: string,
  tokenIdBn: Nullable<BigNumber>,
  contractOnly?: boolean
): boolean => {
  const isContract = contractAddress === search;

  const tokenId = tokenIdBn?.toNumber();

  const fa2TokenIdMatches = (isZeroTokenId(tokenId) && isZeroTokenId(fa2TokenId)) || tokenId === fa2TokenId;

  if (isExist(tokenId) || contractOnly) {
    return isContract && fa2TokenIdMatches;
  }

  const isName = includesCaseInsensitive(metadata?.name, search);

  const isSymbol = includesCaseInsensitive(metadata?.symbol, search);

  return isName || isSymbol || isContract;
};
