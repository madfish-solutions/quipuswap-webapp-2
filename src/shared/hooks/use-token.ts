import { useEffect } from 'react';

import { TOKENS } from '@config/config';
import { Nullable, Token, TokenAddress } from '@shared/types';

import { getTokenMetadata } from '../api';
import { getTokenAddress, getTokenSlug, isString, isExist } from '../helpers';
import { mapBackendToken } from '../mapping/backend-token.map';
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
      const knownToken = TOKENS.tokens
        .map(token => mapBackendToken(token))
        .find(
          whitelistedToken =>
            whitelistedToken.contractAddress === tokenAddress.contractAddress &&
            whitelistedToken.fa2TokenId === tokenAddress.fa2TokenId
        );

      if (isExist(knownToken)) {
        knownToken.isWhitelisted = true;
        tokensStore.setToken(tokenSlug, knownToken);

        return;
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
  }, [tokenSlug, tokensStore]);

  return tokensStore.getToken(tokenSlug);
};
