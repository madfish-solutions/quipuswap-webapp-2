import { useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import { NETWORK_ID } from '@config/enviroment';
import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useAddCustomToken, useSearchCustomTokens, useTokens } from '@providers/dapp-tokens';
import { fallbackToolkits } from '@providers/use-dapp';
import { getTokenType, fa2TokenExists, getTokenSlug } from '@shared/helpers';
import { getTokenIdFromSlug } from '@shared/helpers/tokens/get-token-id-from-slug';
import { Standard } from '@shared/types';
import { isValidTokenSlug } from '@shared/validators';

type TokensSlugs = [string, string];

const DEFAULT_FA2_TOKEN_ID = 0;
const TEZOS_TOKEN_SLUG = getTokenSlug(TEZOS_TOKEN);
const token1FallbackSlug = TEZOS_TOKEN_SLUG;
const token2FallbackSlug = getTokenSlug(DEFAULT_TOKEN);
const FALLBACK_TOKENS_SLUGS: TokensSlugs = [token1FallbackSlug, token2FallbackSlug];

export const useInitialTokensSlugs = (
  fromToSlug?: string,
  getRedirectionUrl?: (token1Slug: string, token2Slug: string) => string
) => {
  const navigate = useNavigate();
  const { data: tokens, loading: tokensLoading } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();
  const addCustomToken = useAddCustomToken();

  const getInitialTokens = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async (_key: string, tokensSlug = ''): Promise<TokensSlugs> => {
      const [rawSlug1 = '', rawSlug2 = ''] = tokensSlug.split('-');
      const tezos = fallbackToolkits[NETWORK_ID];

      const tokensSlugs = await Promise.all(
        [rawSlug1, rawSlug2].map(async (rawSlug, index) => {
          if (isValidTokenSlug(rawSlug) !== true) {
            return FALLBACK_TOKENS_SLUGS[index];
          }
          if (rawSlug.toLowerCase() === TEZOS_TOKEN_SLUG.toLowerCase()) {
            return TEZOS_TOKEN_SLUG;
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
              return getTokenSlug({ fa2TokenId, contractAddress });
            }
          } catch {
            // return statement is below
          }

          return undefined;
        })
      );

      const token1Slug = tokensSlugs[0];
      let token2Slug = tokensSlugs[1];
      if (!token1Slug || !token2Slug) {
        return FALLBACK_TOKENS_SLUGS;
      }
      if (token1Slug === token2Slug) {
        token2Slug = token1Slug === token1FallbackSlug ? token2FallbackSlug : token1FallbackSlug;
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
      navigate(getRedirectionUrl(...initialTokensSlugs));
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
    searchCustomTokens,
    tokens,
    tokensLoading,
    navigate
  ]);

  return initialTokensSlugs;
};
