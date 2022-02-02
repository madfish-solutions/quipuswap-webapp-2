import { useCallback, useEffect } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { Standard } from '@graphql';
import {
  fallbackToolkits,
  getTokenType,
  useTokens,
  useSearchCustomTokens,
  useAddCustomToken,
  fa2TokenExists
} from '@utils/dapp';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import { isValidTokenSlug } from '@utils/validators';

type TokensSlugs = [string, string];

const DEFAULT_FA2_TOKEN_ID = 0;
const FALLBACK_TOKENS_SLUGS: TokensSlugs = [getTokenSlug(TEZOS_TOKEN), getTokenSlug(networksDefaultTokens[NETWORK_ID])];

export const useInitialTokensSlugs = (fromToSlug?: string, getRedirectionUrl?: (fromToSlug: string) => string) => {
  const router = useRouter();
  const { data: tokens, loading: tokensLoading } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();
  const addCustomToken = useAddCustomToken();

  const getInitialTokens = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async (_key: string, tokensSlug = ''): Promise<TokensSlugs> => {
      const [rawSlug1 = '', rawSlug2 = ''] = tokensSlug.split('-');
      const tezos = fallbackToolkits[NETWORK_ID];

      const [tokenSlug1, tokenSlug2] = await Promise.all(
        [rawSlug1, rawSlug2].map(async (rawSlug, index) => {
          if (isValidTokenSlug(rawSlug) !== true) {
            return undefined;
          }
          if (rawSlug.toLowerCase() === getTokenSlug(TEZOS_TOKEN).toLowerCase()) {
            return rawSlug.toLowerCase();
          }

          const isKnownToken = tokens.find(knownToken => getTokenSlug(knownToken) === rawSlug);
          if (isKnownToken) {
            return rawSlug;
          }

          const { contractAddress, fa2TokenId = DEFAULT_FA2_TOKEN_ID } = getTokenIdFromSlug(rawSlug);
          try {
            const tokenType = await getTokenType(contractAddress, tezos);

            if (tokenType === Standard.Fa12) {
              return contractAddress;
            }

            if (tokenType === Standard.Fa2 && (await fa2TokenExists(tezos, contractAddress, fa2TokenId))) {
              return getTokenSlug({ type: tokenType, fa2TokenId, contractAddress });
            }
          } catch {
            // return statement is below
          }

          return undefined;
        })
      );

      if (tokenSlug1 === tokenSlug2) {
        return FALLBACK_TOKENS_SLUGS;
      }

      return [
        tokenSlug1 ?? (tokenSlug2 === FALLBACK_TOKENS_SLUGS[0] ? FALLBACK_TOKENS_SLUGS[1] : FALLBACK_TOKENS_SLUGS[0]),
        tokenSlug2 ?? (tokenSlug1 === FALLBACK_TOKENS_SLUGS[1] ? FALLBACK_TOKENS_SLUGS[0] : FALLBACK_TOKENS_SLUGS[1])
      ];
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
      router.replace(getRedirectionUrl(newTokensSlug), undefined, { shallow: true, scroll: false });
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
