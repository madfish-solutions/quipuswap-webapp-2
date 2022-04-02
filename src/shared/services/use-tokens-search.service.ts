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
import { Nullable, Standard, Token } from '@shared/types';

export const useTokensSearchService = <Type extends { search: string; tokenId: number | string }>(
  blackListedTokens: Array<Token>
) => {
  const tezos = useTezos();

  const searchCustomToken = useSearchCustomTokens();

  const { data: tokens, loading: tokensLoading } = useTokens();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();

  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
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

  const handleTokenSearch = useCallback(async () => {
    if (!tezos) {
      return;
    }

    const isTokens = tokens.filter((token: Token) =>
      localSearchToken(token as TokenWithRequiredNetwork, NETWORK, inputValue, inputToken)
    );

    let foundToken: Nullable<Token> = null;
    if (!isEmptyString(inputValue) && isEmptyArray(isTokens)) {
      foundToken = await searchCustomToken(inputValue, inputToken);
    }
    setFilteredTokens(isExist(foundToken) ? [...isTokens, foundToken] : isTokens);
  }, [inputValue, inputToken, tezos, searchCustomToken, tokens]);

  const isEmptyTokens = useMemo(
    () => isEmptyArray(filteredTokens) && isEmptyArray(searchTokens),
    [searchTokens, filteredTokens]
  );

  useEffect(() => void handleTokenSearch(), [tokens, inputValue, inputToken, handleTokenSearch]);

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
