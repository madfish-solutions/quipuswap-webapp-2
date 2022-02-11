import { useEffect, useRef } from 'react';

import { useTokensSearchService } from '@components/modals/use-tokens-search.service';
import { getTokenIdFromSlug } from '@utils/helpers';
import { Nullable, Optional, Token } from '@utils/types';
import { isValidTokenSlug } from '@utils/validators';

interface TokenSlugSearchState {
  loading: boolean;
  token: Nullable<Token>;
}

const DEFAULT_TOKEN_ID = 0;

export const useTokenSlugSearch = (tokenSlug: Optional<string>): TokenSlugSearchState => {
  const { searchLoading, tokensLoading, handleInput, isSoleFa2Token, allTokens, resetSearchValues, searchTokens } =
    useTokensSearchService([]);
  const prevIsSoleFa2TokenRef = useRef(isSoleFa2Token);

  const slugTokenId = tokenSlug && isValidTokenSlug(tokenSlug) === true ? getTokenIdFromSlug(tokenSlug) : null;
  const slugTokenAddress = slugTokenId?.contractAddress;
  const slugFa2TokenId = slugTokenId?.fa2TokenId;

  useEffect(() => {
    if (slugTokenAddress) {
      handleInput({ search: slugTokenAddress, tokenId: slugFa2TokenId ?? DEFAULT_TOKEN_ID });
    } else {
      resetSearchValues();
    }
  }, [slugTokenAddress, slugFa2TokenId, handleInput, resetSearchValues]);

  useEffect(() => {
    const noKnownTokens = searchTokens.length === allTokens.length;
    if (!prevIsSoleFa2TokenRef.current && isSoleFa2Token && noKnownTokens && slugTokenAddress) {
      handleInput({ search: slugTokenAddress, tokenId: DEFAULT_TOKEN_ID });
    }

    prevIsSoleFa2TokenRef.current = isSoleFa2Token;
  }, [isSoleFa2Token, searchTokens, allTokens, handleInput, slugTokenAddress]);

  const addressMatchingTokens = allTokens.filter(
    ({ contractAddress }) => contractAddress === slugTokenId?.contractAddress
  );
  const token: Token | null =
    addressMatchingTokens.find(
      ({ fa2TokenId }) => slugFa2TokenId === undefined || fa2TokenId === undefined || fa2TokenId === slugFa2TokenId
    ) ??
    addressMatchingTokens[0] ??
    null;

  return {
    loading: searchLoading || tokensLoading,
    token: token
  };
};
