import { useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import { AppRootRoutes } from '@app.router';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useAddCustomToken, useSearchCustomTokens, useTokens } from '@providers/dapp-tokens';
import { makeBasicToolkit } from '@providers/use-dapp';
import {
  getTokenType,
  fa2TokenExists,
  getTokenSlug,
  isEmptyString,
  isArrayPairTuple,
  isTokenEqual
} from '@shared/helpers';
import { getTokenIdFromSlug } from '@shared/helpers/tokens/get-token-id-from-slug';
import { Standard } from '@shared/types';
import { isValidTokenSlug } from '@shared/validators';

import { InvalidTokensPairError } from '../errors';

const DEFAULT_FIRST_TOKEN_SLUG = getTokenSlug(TEZOS_TOKEN);
const DEFAULT_SECOND_TOKEN_SLUG = getTokenSlug(QUIPU_TOKEN);

export const useInitialTokensSlugs = (
  fromToSlug?: string,
  getRedirectionUrl?: (token1Slug: string, token2Slug: string) => string,
  notFoundPageUrl?: string
) => {
  const navigate = useNavigate();
  const { data: tokens, loading: tokensLoading } = useTokens();
  const searchCustomTokens = useSearchCustomTokens();
  const addCustomToken = useAddCustomToken();

  const getInitialTokens = useCallback(
    async (_key: string, tokensSlug = '') => {
      if (isEmptyString(tokensSlug)) {
        return [DEFAULT_FIRST_TOKEN_SLUG, DEFAULT_SECOND_TOKEN_SLUG] as const;
      }

      const [firstTokenSlug, secondTokenSlug = DEFAULT_SECOND_TOKEN_SLUG] = tokensSlug.split('-');
      const rawTokensSlugs = [firstTokenSlug, secondTokenSlug];
      const tezos = makeBasicToolkit();

      if (!isArrayPairTuple(rawTokensSlugs) || rawTokensSlugs.some(slug => isValidTokenSlug(slug) !== true)) {
        throw new InvalidTokensPairError('There should be exactly two valid tokens slugs');
      }

      const tokensExistence = await Promise.all(
        rawTokensSlugs.map(async slug => {
          const tokenId = getTokenIdFromSlug(slug);

          if (tokens.some(token => isTokenEqual(token, tokenId))) {
            return true;
          }

          const actualTokenType = await getTokenType(tokenId.contractAddress, tezos);

          if (actualTokenType === tokenId.type && tokenId.type === Standard.Fa2) {
            return fa2TokenExists(tezos, tokenId.contractAddress, tokenId.fa2TokenId!);
          }

          return actualTokenType === tokenId.type;
        })
      );

      if (tokensExistence.every(Boolean)) {
        return rawTokensSlugs;
      }

      throw new InvalidTokensPairError('One of tokens does not exist');
    },
    [tokens]
  );

  const tokensKey = tokens.map(token => getTokenSlug(token)).join(',');
  const { data: initialTokensSlugs, error: initialTokensError } = useSWR(
    ['initial-tokens', fromToSlug, tokensKey],
    getInitialTokens
  );

  useEffect(() => {
    if (initialTokensError instanceof InvalidTokensPairError) {
      navigate(notFoundPageUrl ?? `${AppRootRoutes.NotFound}`);

      return;
    }

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
    initialTokensError,
    initialTokensSlugs,
    getRedirectionUrl,
    searchCustomTokens,
    tokens,
    tokensLoading,
    navigate,
    notFoundPageUrl
  ]);

  return initialTokensSlugs;
};
