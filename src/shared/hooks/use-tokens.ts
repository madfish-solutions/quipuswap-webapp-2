import { useEffect } from 'react';

import { Optional } from '@shared/types';

import { getTokenMetadata } from '../api';
import { getTokenAddress } from '../helpers';
import { mapToken } from '../mapping/token.map';
import { useTokensStore } from './use-tokens-store';

export const useTokens = (tokenSlugs: Optional<string[]>) => {
  const tokensStore = useTokensStore();

  useEffect(() => {
    (async () => {
      if (!tokenSlugs) {
        return;
      }
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
      await Promise.all(promises);
    })();
  }, [tokenSlugs, tokensStore]);
};
