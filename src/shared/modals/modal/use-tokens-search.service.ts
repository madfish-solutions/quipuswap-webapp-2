import { useCallback, useEffect, useMemo, useState } from 'react';

import { NETWORK } from '@config';
import { Standard } from 'types/types';
import { getTokenType } from '@shared/dapp/tokens';
import { useTezos } from '@shared/dapp/dapp';
import { useSearchCustomTokens, useSearchTokens, useTokens } from '@shared/dapp/dapp-tokens';
import { localSearchToken } from '@shared/helpers/local-search-token';
import { TokenWithRequiredNetwork } from '@shared/helpers/local-search-token';
import { isTokenEqual } from '@shared/helpers/is-token-equal';
import { isExist } from '@shared/helpers/type-checks';
import { defined } from '@shared/helpers/type-checks';
import { isEmptyArray } from '@shared/helpers/type-checks';
import { isEmptyString } from '@shared/helpers/strings';

import { Token } from 'types/types';
import { Nullable } from 'types/types';

import { DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID } from '../constants';
import { getTokenKey } from '../get-token-key';

const uniqTokens = (tokens: Array<Token>) => {
  const contractAddressMap = new Map<string, boolean>();
  const FLAG = true;

  return tokens.filter(token => {
    const key = getTokenKey(token);
    const value = contractAddressMap.get(key);
    if (value) {
      return false;
    } else {
      contractAddressMap.set(key, FLAG);

      return true;
    }
  });
};

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
      const uniqTokens_ = uniqTokens(targetTokens);

      return uniqTokens_.filter(x => !blackListedTokens.find(y => isTokenEqual(x, y)));
      // inputValue is needed
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValue, filteredTokens, searchTokens, blackListedTokens]
  );

  useEffect(() => {
    getTokenType(inputValue, defined(tezos)).then(tokenType => setSoleFa2Token(tokenType === Standard.Fa2));
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
