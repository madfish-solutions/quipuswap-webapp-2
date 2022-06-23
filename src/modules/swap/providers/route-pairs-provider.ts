import { useCallback, useEffect, useMemo, useState } from 'react';

import constate from 'constate';
import { useAllRoutePairs } from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

import { KNOWN_DEX_TYPES, TEZOS_DEXES_API_URL } from '../config';

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

  return { dataIsStale, routePairs: displayedRoutePairs, updateRoutePairs, loading };
});
