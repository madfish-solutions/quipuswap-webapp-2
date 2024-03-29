import { useEffect } from 'react';

import { Optional, TokenAddress } from '@shared/types';

import { useTokensStore } from './use-tokens-store';
import { getTokenMetadata } from '../api';
import { getTokenAddress, getTokenSlug, isString } from '../helpers';
import { mapToken } from '../mapping/token.map';

export const useTokensLoader = (tokens: Optional<Array<TokenAddress | string>>) => {
  const tokensStore = useTokensStore();

  useEffect(() => {
    (async () => {
      if (!tokens || !tokens.length) {
        return;
      }
      tokensStore.setLoading(true);
      const tokenSlugs = tokens.map(tokenSlugOrAddress =>
        isString(tokenSlugOrAddress) ? tokenSlugOrAddress : getTokenSlug(tokenSlugOrAddress)
      );
      const promises = tokenSlugs
        .filter(tokenSlug => !tokensStore.getToken(tokenSlug))
        .map(async tokenSlug => {
          const tokenAddress = getTokenAddress(tokenSlug);
          const tokenMetaRaw = await getTokenMetadata(tokenAddress);
          if (tokenMetaRaw) {
            const token = mapToken({
              ...tokenAddress,
              metadata: tokenMetaRaw
            });
            tokensStore.setToken(tokenSlug, token);
          }
        });
      try {
        await Promise.all(promises);
      } finally {
        tokensStore.setLoading(false);
      }
    })();
  }, [tokens, tokensStore]);
};
