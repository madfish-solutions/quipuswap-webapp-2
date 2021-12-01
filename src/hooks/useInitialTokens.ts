import { useCallback } from 'react';
import useSWR from 'swr';

import {
  fallbackToolkits,
  getTokenType,
  useNetwork,
} from '@utils/dapp';
import { QSNetworkType } from '@utils/types';
import { networksDefaultTokens, TEZOS_TOKEN } from '@utils/defaults';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import { isValidTokenSlug } from '@utils/validators';

type TokensSlugs = [string, string];

type InitialTokensValue = {
  slugs: TokensSlugs;
  network: QSNetworkType;
};

export const useInitialTokens = (fromToSlug?: string) => {
  const network = useNetwork();

  const getInitialTokens = useCallback(
    async (_key: string, currentNetworkId: QSNetworkType, tokensSlug: string = ''): Promise<InitialTokensValue> => {
      const currentNetworkFallbackTokensSlugs: TokensSlugs = [
        getTokenSlug(TEZOS_TOKEN),
        getTokenSlug(networksDefaultTokens[currentNetworkId]),
      ];
      const rawSlugs = tokensSlug.split('-').slice(0, 2);
      while (rawSlugs.length < 2) {
        rawSlugs.push('');
      }
      const tokensSearchResults = await Promise.all(
        Object.entries(fallbackToolkits).map(async ([networkId, tezos]) => {
          const fallbackTokensSlugs = [
            getTokenSlug(TEZOS_TOKEN),
            getTokenSlug(networksDefaultTokens[currentNetworkId]),
          ];
          const [token1Slug, token2Slug] = await Promise.all(
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
          return token1Slug && token2Slug ? {
            network: networkId,
            slugs: [token1Slug, token2Slug],
          } : undefined;
        }),
      );
      const networksPriorityOrder: QSNetworkType[] = ['mainnet', currentNetworkId];
      const searchResult = tokensSearchResults
        .filter((value): value is InitialTokensValue => value !== undefined)
        .sort(
          (
            { network: networkA },
            { network: networkB },
          ) => networksPriorityOrder.indexOf(networkB) - networksPriorityOrder.indexOf(networkA),
        )[0];
      if (searchResult) {
        const token1Slug = searchResult.slugs[0];
        let token2Slug = searchResult.slugs[1];
        if (token1Slug === token2Slug) {
          token2Slug = token1Slug === currentNetworkFallbackTokensSlugs[0]
            ? currentNetworkFallbackTokensSlugs[1]
            : currentNetworkFallbackTokensSlugs[0];
        }
        return {
          slugs: [token1Slug, token2Slug],
          network: searchResult.network,
        };
      }

      return {
        slugs: currentNetworkFallbackTokensSlugs,
        network: currentNetworkId,
      };
    },
    [],
  );

  const { data: initialTokensSlugs } = useSWR(
    ['initial-tokens', network.id, fromToSlug],
    getInitialTokens,
  );

  return initialTokensSlugs;
};
