import { useCallback, useEffect, useMemo, useState } from 'react';

import { NETWORK } from '@app.config';
import { Standard } from '@graphql';
import { getTokenType, useSearchCustomTokens, useSearchTokens, useTezos, useTokens } from '@utils/dapp';
import { isEmptyArray, isTokenEqual, localSearchToken } from '@utils/helpers';
import { isEmptyString } from '@utils/helpers/strings';
import { WhitelistedToken } from '@utils/types';

import { DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID } from './constants';

const uniqTokens = (tokens: Array<WhitelistedToken>) => {
  const contractAddressMap = new Map<string, number>();
  const _ = 1;

  return tokens.filter(token => {
    const key = token.contractAddress;
    const value = contractAddressMap.get(key);
    if (value) {
      return false;
    } else {
      contractAddressMap.set(key, _);

      return true;
    }
  });
};

export const useTokensSearchService = <Type extends { search: string; tokenId: number | string }>(
  blackListedTokens: Array<WhitelistedToken>
) => {
  const tezos = useTezos();

  const searchCustomToken = useSearchCustomTokens();

  const { data: tokens, loading: tokensLoading } = useTokens();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();

  const [filteredTokens, setFilteredTokens] = useState<WhitelistedToken[]>([]);
  const [inputValue, setInputValue] = useState(DEFAULT_SEARCH_VALUE);
  const [inputToken, setInputToken] = useState(DEFAULT_TOKEN_ID);
  const [isSoleFa2Token, setSoleFa2Token] = useState(false);

  const handleInput = (values: Type) => {
    setInputValue(values.search ?? DEFAULT_SEARCH_VALUE);
    setInputToken(isSoleFa2Token ? Number(values.tokenId) : DEFAULT_TOKEN_ID);
  };

  const resetSearchValues = () => {
    setInputValue(DEFAULT_SEARCH_VALUE);
    setInputToken(DEFAULT_TOKEN_ID);
  };

  const handleTokenSearch = useCallback(() => {
    if (!tezos) {
      return;
    }

    const isTokens = tokens.filter((token: WhitelistedToken) =>
      localSearchToken(token, NETWORK, inputValue, inputToken)
    );
    setFilteredTokens(isTokens);
    if (!isEmptyString(inputValue) && isEmptyArray(isTokens)) {
      searchCustomToken(inputValue, inputToken);
    }
  }, [inputValue, inputToken, tezos, searchCustomToken, tokens]);

  const isEmptyTokens = useMemo(
    () => isEmptyArray(filteredTokens) && isEmptyArray(searchTokens),
    [searchTokens, filteredTokens]
  );

  useEffect(() => handleTokenSearch(), [tokens, inputValue, inputToken, handleTokenSearch]);

  const allTokens = useMemo(
    () => uniqTokens(filteredTokens.concat(searchTokens)).filter(x => !blackListedTokens.find(y => isTokenEqual(x, y))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValue, filteredTokens, searchTokens, blackListedTokens]
  );

  useEffect(() => {
    getTokenType(inputValue, tezos!).then(tokenType => setSoleFa2Token(tokenType === Standard.Fa2));
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
