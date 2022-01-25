import { useCallback, useEffect } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { Standard } from '@graphql';
import { fallbackToolkits, getTokenType, useTokens, useSearchCustomTokens, useAddCustomToken } from '@utils/dapp';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import { isValidTokenSlug } from '@utils/validators';

type TokensSlugs = [string, string];

export const useInitialTokensSlugs = (fromToSlug?: string, getRedirectionUrl?: (fromToSlug: string) => string) => {
  const router = useRouter();
  const { data: tokens, loading: tokensLoading } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();
  const addCustomToken = useAddCustomToken();

  const getInitialTokens = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async (_key: string, tokensSlug = ''): Promise<TokensSlugs> => {
      const fallbackTokensSlugs: TokensSlugs = [
        getTokenSlug(TEZOS_TOKEN),
        getTokenSlug(networksDefaultTokens[NETWORK_ID])
      ];
      const rawSlugs: string[] = tokensSlug.split('-').slice(0, 2);
      while (rawSlugs.length < 2) {
        rawSlugs.push('');
      }
      const tezos = fallbackToolkits[NETWORK_ID];
      const tokensSlugs = await Promise.all(
        rawSlugs.map(async (rawSlug, index) => {
          if (!rawSlug || isValidTokenSlug(rawSlug) !== true) {
            return fallbackTokensSlugs[index];
          }
          if (rawSlug.toLowerCase() === getTokenSlug(TEZOS_TOKEN).toLowerCase()) {
            return rawSlug.toLowerCase();
          }
          const { contractAddress, fa2TokenId } = getTokenIdFromSlug(rawSlug);
          try {
            const alreadyKnownToken = tokens.find(knownToken => getTokenSlug(knownToken) === rawSlug);
            const tokenType = alreadyKnownToken?.type ?? (await getTokenType(contractAddress, tezos));
            if (tokenType === Standard.Fa2) {
              return `${contractAddress}_${fa2TokenId ?? 0}`;
            }
            if (tokenType === Standard.Fa12) {
              return contractAddress;
            }

            return undefined;
          } catch (e) {
            return undefined;
          }
        })
      );
      const token1Slug = tokensSlugs[0];
      let token2Slug = tokensSlugs[1];
      if (!token1Slug || !token2Slug) {
        return fallbackTokensSlugs;
      }
      if (token1Slug === token2Slug) {
        token2Slug = token1Slug === fallbackTokensSlugs[0] ? fallbackTokensSlugs[1] : fallbackTokensSlugs[0];
      }

      return [token1Slug, token2Slug];
    },
    [tokens]
  );

  const tokensKey = tokens.map(token => getTokenSlug(token)).join(',');
  const { data: initialTokensSlugs } = useSWR(['initial-tokens', fromToSlug, tokensKey], getInitialTokens);

  useEffect(() => {
    if (tokensLoading || !initialTokensSlugs) {
      return;
    }
    const newTokensSlug = initialTokensSlugs.join('-');
    if (getRedirectionUrl && fromToSlug !== newTokensSlug) {
      router.replace(getRedirectionUrl(newTokensSlug));
    }
    initialTokensSlugs.forEach(tokenSlug => {
      const isTez = tokenSlug.toLowerCase() === getTokenSlug(TEZOS_TOKEN).toLowerCase();
      const tokenIsKnown = isTez || tokens.some(token => getTokenSlug(token) === tokenSlug);
      const { contractAddress, fa2TokenId } = getTokenIdFromSlug(tokenSlug);
      if (!tokenIsKnown) {
        searchCustomTokens(contractAddress, fa2TokenId).then(customToken => {
          if (customToken) {
            addCustomToken(customToken);
          }
        });
      }
    });
  }, [
    addCustomToken,
    fromToSlug,
    initialTokensSlugs,
    getRedirectionUrl,
    router,
    searchCustomTokens,
    tokens,
    tokensLoading
  ]);

  return initialTokensSlugs;
};
