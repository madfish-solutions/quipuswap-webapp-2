import { useEffect } from 'react';

import { Token, TokenAddress } from '@shared/types';

import { getTokenMetadata } from '../api';
import { getTokenAddress, getTokenSlug, isString } from '../helpers';
import { mapToken } from '../mapping/token.map';
import { useTokensStore } from './use-tokens-store';

export const useToken = (tokenSlugOrAddress: TokenAddress | string): Nullable<Token> => {
  const tokensStore = useTokensStore();

  const tokenSlug = isString(tokenSlugOrAddress) ? tokenSlugOrAddress : getTokenSlug(tokenSlugOrAddress);
  const tokenAddress = getTokenAddress(tokenSlug);

  useEffect(() => {
    (async () => {
      if (tokensStore.getToken(tokenSlug)) {
        return false;
      }
      const tokenMetaRaw = await getTokenMetadata(tokenAddress);
      if (tokenMetaRaw) {
        const token = mapToken({
          ...tokenAddress,
          metadata: tokenMetaRaw
        });
        tokensStore.setToken(tokenSlug, token);
      }
    })();
  }, [tokenAddress, tokenSlug, tokensStore]);

  return tokensStore.getToken(tokenSlug);
};
