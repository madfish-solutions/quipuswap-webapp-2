import { useCallback, useEffect, useMemo, useState } from 'react';

import { NETWORK } from '@config/config';
import { DEBOUNCE_MS, DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID } from '@config/constants';
import { useSearchCustomTokens, useSearchTokens, useTokens } from '@providers/dapp-tokens';
import { useTezos } from '@providers/use-dapp';
import {
  getTokenSlug,
  getTokenType,
  getUniqArray,
  isEmptyArray,
  isEmptyString,
  isExist,
  isTokenEqual,
  localSearchToken,
  TokenWithRequiredNetwork
} from '@shared/helpers';
import { useDebouncedState, useUpdateOnBlockSWR } from '@shared/hooks';
import { Nullable, Standard, Token } from '@shared/types';

const FALLBACK_FILTERED_TOKENS: Array<Token> = [];

export const useTokensSearch = (
  blackListedTokens: Array<Token>,
  searchInputValue = DEFAULT_SEARCH_VALUE,
  tokenId?: number
) => {
  const tezos = useTezos();

  const searchCustomToken = useSearchCustomTokens();

  const { data: tokens, loading: tokensLoading } = useTokens();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();

  const [debouncedSearchInputValue, debouncedSetSearchInputValue] = useDebouncedState(DEBOUNCE_MS, searchInputValue);
  const [debouncedTokenId, debouncedSetTokenId] = useDebouncedState(DEBOUNCE_MS, tokenId);

  const [isSoleFa2Token, setSoleFa2Token] = useState(false);

  const getTokens = useCallback(
    async (_: string, newInputValue: string, newTokenId = DEFAULT_TOKEN_ID) => {
      if (!tezos) {
        return [];
      }

      const isTokens = tokens.filter((token: Token) =>
        localSearchToken(token as TokenWithRequiredNetwork, NETWORK, newInputValue, newTokenId)
      );

      let foundToken: Nullable<Token> = null;
      if (!isEmptyString(newInputValue) && isEmptyArray(isTokens)) {
        foundToken = await searchCustomToken(newInputValue, newTokenId);
      }

      return isExist(foundToken) ? isTokens.concat(foundToken) : isTokens;
    },
    [searchCustomToken, tezos, tokens]
  );

  const knownTokensSWRKey = useMemo(() => tokens.map(getTokenSlug).join(','), [tokens]);
  const { data: filteredTokens = FALLBACK_FILTERED_TOKENS } = useUpdateOnBlockSWR(
    tezos,
    ['token-search', debouncedSearchInputValue, debouncedTokenId, knownTokensSWRKey, Boolean(tezos)],
    getTokens
  );

  const isEmptyTokens = useMemo(
    () => isEmptyArray(filteredTokens) && isEmptyArray(searchTokens),
    [searchTokens, filteredTokens]
  );

  const isCurrentToken = (token: Token) =>
    token.contractAddress.toLocaleLowerCase() === debouncedSearchInputValue.toLocaleLowerCase() &&
    token.fa2TokenId === debouncedTokenId;

  const allTokens = useMemo(
    () => {
      const targetTokens = !isEmptyArray(filteredTokens) ? filteredTokens : searchTokens.filter(isCurrentToken);
      const uniqTokens_ = getUniqArray(targetTokens, getTokenSlug);

      return uniqTokens_.filter(x => !blackListedTokens.find(y => isTokenEqual(x, y)));
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchInputValue, filteredTokens, searchTokens, blackListedTokens]
  );

  useEffect(() => debouncedSetSearchInputValue(searchInputValue), [debouncedSetSearchInputValue, searchInputValue]);
  useEffect(() => debouncedSetTokenId(tokenId), [debouncedSetTokenId, tokenId]);

  useEffect(() => {
    if (tezos) {
      getTokenType(debouncedSearchInputValue, tezos).then(tokenType => setSoleFa2Token(tokenType === Standard.Fa2));
    }
  }, [debouncedSearchInputValue, tezos]);

  const isTokensNotFound = isEmptyTokens && !searchLoading && !tokensLoading;
  const isTokensLoading = isEmptyTokens && (searchLoading || tokensLoading);

  return {
    searchLoading,
    tokensLoading,
    isSoleFa2Token,
    isEmptyTokens,
    allTokens,
    searchTokens,
    isTokensNotFound,
    isTokensLoading
  };
};
