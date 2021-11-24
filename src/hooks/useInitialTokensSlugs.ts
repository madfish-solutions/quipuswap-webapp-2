import { useCallback, useMemo } from 'react';

import {
  fallbackToolkits,
  getContract,
  isTokenFa2,
  useNetwork,
} from '@utils/dapp';
import useContinuousSWR from '@hooks/useContinuousSWR';
import { QSMainNet } from '@utils/types';
import { networksStableTokens, TEZOS_TOKEN } from '@utils/defaults';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import { isValidTokenSlug } from '@utils/validators';

type TokensSlugs = [string, string];

export const useInitialTokensSlugs = (fromToSlug?: string) => {
  const network = useNetwork();

  const fallbackTokensSlugs = useMemo<TokensSlugs>(() => [
    getTokenSlug(TEZOS_TOKEN),
    getTokenSlug(networksStableTokens[network.id as QSMainNet]),
  ], [network.id]);

  const getInitialTokens = useCallback(
    async (_key: string, networkId: QSMainNet, tokensSlug = '') => {
      const rawSlugs: [string | undefined, string | undefined] = tokensSlug.split('-').slice(0, 2);
      // eslint-disable-next-line prefer-const
      let [token1Slug, token2Slug] = await Promise.all(
        rawSlugs.map(async (rawSlug, index) => {
          try {
            const tezos = fallbackToolkits[networkId];
            if (!rawSlug || (isValidTokenSlug(rawSlug) !== true)) {
              throw new Error(`Invalid slug ${rawSlug}`);
            }
            if (rawSlug === 'tez') {
              return rawSlug;
            }
            const { contractAddress, fa2TokenId } = getTokenIdFromSlug(rawSlug);
            await getContract(tezos, contractAddress);
            try {
              const isFa2Token = await isTokenFa2(contractAddress, tezos);
              if (isFa2Token) {
                return `${contractAddress}_${fa2TokenId ?? 0}`;
              }
              return contractAddress;
            } catch (e) {
              return rawSlug;
            }
          } catch (e) {
            console.error(e);
            return fallbackTokensSlugs[index];
          }
        }),
      );
      if (token1Slug === token2Slug) {
        token2Slug = token1Slug === fallbackTokensSlugs[0]
          ? fallbackTokensSlugs[1]
          : fallbackTokensSlugs[0];
      }
      return [token1Slug, token2Slug] as TokensSlugs;
    },
    [fallbackTokensSlugs],
  );

  const { data: initialTokensSlugs } = useContinuousSWR(
    ['initial-tokens', network.id, fromToSlug],
    getInitialTokens,
  );

  return initialTokensSlugs;
};
