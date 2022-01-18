import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { networksDefaultTokens, TEZOS_TOKEN } from '@app.config';
import { Standard } from '@graphql';
import {
  fallbackToolkits,
  getTokenType,
  useNetwork,
  useTokens,
  useSearchCustomTokens,
  useAddCustomToken
} from '@utils/dapp';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import { QSMainNet } from '@utils/types';
import { isValidTokenSlug } from '@utils/validators';

type TokensSlugs = [string, string];

export const useInitialTokensSlugs = (fromToSlug?: string, getRedirectionUrl?: (fromToSlug: string) => string) => {
  const network = useNetwork();
  const router = useRouter();
  const { data: tokens, loading: tokensLoading } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();
  const addCustomToken = useAddCustomToken();
  const prevNetworkIdRef = useRef<QSMainNet | undefined>();

  const getInitialTokens = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async (_key: string, networkId: QSMainNet, tokensSlug = ''): Promise<TokensSlugs> => {
      const fallbackTokensSlugs: TokensSlugs = [
        getTokenSlug(TEZOS_TOKEN),
        getTokenSlug(networksDefaultTokens[networkId])
      ];
      const rawSlugs: string[] = tokensSlug.split('-').slice(0, 2);
      while (rawSlugs.length < 2) {
        rawSlugs.push('');
      }
      const tezos = fallbackToolkits[networkId];
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
  const { data: initialTokensSlugs } = useSWR(['initial-tokens', network.id, fromToSlug, tokensKey], getInitialTokens);

  useEffect(() => {
    const prevNetworkId = prevNetworkIdRef.current;

    if (prevNetworkId === network.id || tokensLoading || !initialTokensSlugs) {
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
    prevNetworkIdRef.current = network.id;
  }, [
    addCustomToken,
    fromToSlug,
    initialTokensSlugs,
    network.id,
    getRedirectionUrl,
    router,
    searchCustomTokens,
    tokens,
    tokensLoading
  ]);

  return initialTokensSlugs;
};
