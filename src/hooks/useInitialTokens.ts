import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import useSWR from 'swr';

import {
  fallbackToolkits,
  getTokenType,
  useNetwork,
  useAddCustomToken,
  useSearchCustomTokens,
  useTokens,
} from '@utils/dapp';
import { QSMainNet } from '@utils/types';
import { networksDefaultTokens, TEZOS_TOKEN } from '@utils/defaults';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import { isValidTokenSlug } from '@utils/validators';
import { makeWhitelistedToken } from '@hooks/useDexGraph';

type TokensSlugs = [string, string];

export const useInitialTokens = (
  fromToSlug?: string,
  getRedirectionUrl?: (fromToSlug: string) => string,
) => {
  const network = useNetwork();
  const router = useRouter();
  const { data: tokens, loading: tokensLoading } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();
  const addCustomToken = useAddCustomToken();
  const prevNetworkIdRef = useRef<QSMainNet | undefined>();

  const getInitialTokens = useCallback(
    async (_key: string, networkId: QSMainNet, tokensSlug: string = ''): Promise<TokensSlugs> => {
      const fallbackTokensSlugs: TokensSlugs = [
        getTokenSlug(TEZOS_TOKEN),
        getTokenSlug(networksDefaultTokens[networkId]),
      ];
      const rawSlugs = tokensSlug.split('-').slice(0, 2);
      while (rawSlugs.length < 2) {
        rawSlugs.push('');
      }
      const tezos = fallbackToolkits[networkId];
      const tokensSlugs = await Promise.all(
        rawSlugs.map(async (rawSlug, index) => {
          if (!rawSlug || (isValidTokenSlug(rawSlug) !== true)) {
            return fallbackTokensSlugs[index];
          }
          if (rawSlug === getTokenSlug(TEZOS_TOKEN)) {
            return rawSlug;
          }
          const { contractAddress, fa2TokenId } = getTokenIdFromSlug(rawSlug);
          try {
            const tokenType = await getTokenType(contractAddress, tezos);
            if (tokenType === 'fa2') {
              return `${contractAddress}_${fa2TokenId ?? 0}`;
            }
            if (tokenType === 'fa1.2') {
              return contractAddress;
            }
            return undefined;
          } catch (e) {
            return undefined;
          }
        }),
      );
      const token1Slug = tokensSlugs[0];
      let token2Slug = tokensSlugs[1];
      if (!token1Slug || !token2Slug) {
        return fallbackTokensSlugs;
      }
      if (token1Slug === token2Slug) {
        token2Slug = token1Slug === fallbackTokensSlugs[0]
          ? fallbackTokensSlugs[1]
          : fallbackTokensSlugs[0];
      }
      return [token1Slug, token2Slug];
    },
    [],
  );

  const { data: initialTokensSlugs } = useSWR(
    ['initial-tokens', network.id, fromToSlug],
    getInitialTokens,
  );

  useEffect(() => {
    const prevNetworkId = prevNetworkIdRef.current;

    if ((prevNetworkId === network.id) || tokensLoading || !initialTokensSlugs) {
      return;
    }
    const newTokensSlug = initialTokensSlugs.join('-');
    if (getRedirectionUrl && (fromToSlug !== newTokensSlug)) {
      router.push(getRedirectionUrl(newTokensSlug));
    }
    initialTokensSlugs.forEach((tokenSlug) => {
      const isTez = tokenSlug === getTokenSlug(TEZOS_TOKEN);
      const tokenIsKnown = isTez || tokens.some(
        (token) => getTokenSlug(token) === tokenSlug,
      );
      const { contractAddress, fa2TokenId, type: tokenType } = getTokenIdFromSlug(tokenSlug);
      if (!tokenIsKnown) {
        searchCustomTokens(contractAddress, fa2TokenId)
          .then((customToken) => {
            if (customToken) {
              addCustomToken(customToken);
            } else {
              addCustomToken(makeWhitelistedToken(
                { address: contractAddress, id: fa2TokenId, type: tokenType },
                [],
              ));
            }
          })
          .catch(console.error);
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
    tokensLoading,
  ]);

  return initialTokensSlugs;
};
