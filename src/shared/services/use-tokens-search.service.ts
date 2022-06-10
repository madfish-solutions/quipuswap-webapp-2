import { useCallback, useEffect, useMemo, useState } from 'react';

import { NETWORK } from '@config/config';
import { DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID } from '@config/constants';
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
import { useUpdateOnBlockSWR } from '@shared/hooks';
import { Nullable, Standard, Token } from '@shared/types';

const FALLBACK_FILTERED_TOKENS: Array<Token> = [];

export const useTokensSearchService = <Type extends { search: string; tokenId: number | string }>(
  blackListedTokens: Array<Token>
) => {
  const tezos = useTezos();

  const searchCustomToken = useSearchCustomTokens();

  const { data: tokens, loading: tokensLoading } = useTokens();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();

  const [inputValue, setInputValue] = useState(DEFAULT_SEARCH_VALUE);
  const [inputToken, setInputToken] = useState(DEFAULT_TOKEN_ID);
  const [isSoleFa2Token, setSoleFa2Token] = useState(false);

  const handleInput = (values: Type) => {
    setInputValue(values.search ?? DEFAULT_SEARCH_VALUE);
    setInputToken(isSoleFa2Token && Boolean(values.tokenId) ? Number(values.tokenId) : DEFAULT_TOKEN_ID);
  };

  const resetSearchValues = () => {
    setInputValue(DEFAULT_SEARCH_VALUE);
    setInputToken(DEFAULT_TOKEN_ID);
  };

  const getTokens = useCallback(
    async (_: string, newInputValue: string, newInputToken: number) => {
      if (!tezos) {
        return [];
      }

      const isTokens = tokens.filter((token: Token) =>
        localSearchToken(token as TokenWithRequiredNetwork, NETWORK, newInputValue, newInputToken)
      );

      let foundToken: Nullable<Token> = null;
      if (!isEmptyString(newInputValue) && isEmptyArray(isTokens)) {
        foundToken = await searchCustomToken(newInputValue, newInputToken);
      }

      return isExist(foundToken) ? [...isTokens, foundToken] : isTokens;
    },
    [searchCustomToken, tezos, tokens]
  );

  const knownTokensSWRKey = useMemo(() => tokens.map(getTokenSlug).join(','), [tokens]);
  const { data: filteredTokens = FALLBACK_FILTERED_TOKENS } = useUpdateOnBlockSWR(
    tezos,
    ['token-search', inputValue, inputToken, knownTokensSWRKey, Boolean(tezos)],
    getTokens
  );

  const isEmptyTokens = useMemo(
    () => isEmptyArray(filteredTokens) && isEmptyArray(searchTokens),
    [searchTokens, filteredTokens]
  );

  const isCurrentToken = (token: Token) =>
    token.contractAddress.toLocaleLowerCase() === inputValue.toLocaleLowerCase() && token.fa2TokenId === inputToken;

  const allTokens = useMemo(
    () => {
      const targetTokens = !isEmptyArray(filteredTokens) ? filteredTokens : searchTokens.filter(isCurrentToken);
      const uniqTokens_ = getUniqArray(targetTokens, getTokenSlug);

      return uniqTokens_.filter(x => !blackListedTokens.find(y => isTokenEqual(x, y)));
      // inputValue is needed
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValue, filteredTokens, searchTokens, blackListedTokens]
  );

  useEffect(() => {
    if (tezos) {
      getTokenType(inputValue, tezos).then(tokenType => setSoleFa2Token(tokenType === Standard.Fa2));
    }
  }, [inputValue, tezos]);

  const isTokensNotFound = isEmptyTokens && !searchLoading && !tokensLoading;
  const isTokensLoading = isEmptyTokens && (searchLoading || tokensLoading);

  return {
    searchLoading,
    tokensLoading,
    handleInput,
    isSoleFa2Token,
    isEmptyTokens,
    allTokens,
    resetSearchValues,
    setInputValue,
    setInputToken,
    searchTokens,
    isTokensNotFound,
    isTokensLoading
  };
};
