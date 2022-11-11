import { useEffect } from 'react';

import { Nullable, Token, TokenAddress } from '@shared/types';

import { getTokenMetadata } from '../api';
import { getTokenAddress, getTokenSlug, isString } from '../helpers';
import { mapToken } from '../mapping/token.map';
import { useTokensStore } from './use-tokens-store';

export const useToken = (tokenSlugOrAddress: Nullable<TokenAddress | string>): Nullable<Token> => {
  const tokensStore = useTokensStore();

  const tokenSlug = tokenSlugOrAddress
    ? isString(tokenSlugOrAddress)
      ? tokenSlugOrAddress
      : getTokenSlug(tokenSlugOrAddress)
    : null;

  useEffect(() => {
    (async () => {
      if (!tokenSlug || tokensStore.getToken(tokenSlug)) {
        return;
      }
      const tokenAddress = getTokenAddress(tokenSlug);
      const tokenMetaRaw = await getTokenMetadata(tokenAddress);
      if (tokenMetaRaw) {
        const token = mapToken({
          ...tokenAddress,
          metadata: tokenMetaRaw
        });
        tokensStore.setToken(tokenSlug, token);
      }
    })();
  }, [tokenSlug, tokensStore]);

  return tokensStore.getToken(tokenSlug);
};
