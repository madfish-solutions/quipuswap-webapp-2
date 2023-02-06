import { useCallback, useEffect, useMemo, useState } from 'react';

import constate from 'constate';
import { RouteDirectionEnum, useAllRoutePairs } from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

import { TOKENS } from '@config/config';
import { ZERO_AMOUNT_BN } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN, WTEZ_TOKEN } from '@config/tokens';
import { getTokenSlug, getUniqArray } from '@shared/helpers';
import { mapBackendToken } from '@shared/mapping';
import { Token } from '@shared/types';

import { KNOWN_DEX_TYPES, TEZOS_DEXES_API_URL } from '../config';
import { extractTokensPools } from '../utils/map-dex-pairs';

const tokensMap = new Map<string, Token>(
  TOKENS.tokens
    .map((token): [string, Token] => {
      const mappedToken = mapBackendToken(token);

      return [getTokenSlug(mappedToken), mappedToken];
    })
    .concat([
      [getTokenSlug(TEZOS_TOKEN), TEZOS_TOKEN],
      [getTokenSlug(WTEZ_TOKEN), WTEZ_TOKEN],
      [getTokenSlug(QUIPU_TOKEN), QUIPU_TOKEN]
    ])
);

// TODO: replace it with store after route pairs become available not only from hook
export const [RoutePairsProvider, useRoutePairs] = constate(() => {
  const { data: allRoutePairs } = useAllRoutePairs(TEZOS_DEXES_API_URL);

  const filteredRoutePairs = useMemo(
    () => allRoutePairs.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs]
  );

  const [loading, setLoading] = useState(true);
  const [displayedRoutePairs, setDisplayedRoutePairs] = useState<RoutePair[]>(filteredRoutePairs);
  const dataIsStale = displayedRoutePairs !== filteredRoutePairs;

  const updateRoutePairs = useCallback(() => setDisplayedRoutePairs(filteredRoutePairs), [filteredRoutePairs]);
  useEffect(() => {
    if (loading && dataIsStale) {
      updateRoutePairs();
      setLoading(false);
    }
  }, [updateRoutePairs, loading, dataIsStale]);

  const whitelistedPairs = useMemo(() => {
    return getUniqArray(
      filteredRoutePairs
        .filter(pair => {
          try {
            extractTokensPools(
              {
                ...pair,
                aTokenAmount: ZERO_AMOUNT_BN,
                bTokenAmount: ZERO_AMOUNT_BN,
                direction: RouteDirectionEnum.Direct
              },
              tokensMap
            );

            return true;
          } catch {
            return false;
          }
        })
        .map(({ dexType, dexAddress, dexId }) => ({ dexType, dexAddress, dexId })),
      ({ dexAddress, dexId }) => getTokenSlug({ contractAddress: dexAddress, fa2TokenId: dexId?.toNumber() })
    );
  }, [filteredRoutePairs]);

  return { dataIsStale, routePairs: displayedRoutePairs, updateRoutePairs, loading, whitelistedPairs };
});
