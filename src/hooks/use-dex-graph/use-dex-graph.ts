import { useCallback, useEffect, useMemo, useState } from 'react';

import constate from 'constate';

import { DEX_POOLS_URLS, NETWORK_ID } from '@app.config';
import { useToasts } from '@hooks/use-toasts';
import { useWebSocket } from '@hooks/use-web-socket';
import { useOnBlock, useTezos, useTokens } from '@utils/dapp';

import { dexPairsToSwapGraph, rawDexToDexPair } from './helpers';
import { RawDexPool, RawDexType } from './use-dex-graph.types';

const fallbackRawDexPools: RawDexPool[] = [];

export const [DexGraphProvider, useDexGraph] = constate(() => {
  const { data: tokens } = useTokens();
  const tezos = useTezos();
  const { showErrorToast } = useToasts();

  const handleLoadError = useCallback(
    () => showErrorToast(`An error occurred while loading exchange rates`),
    [showErrorToast]
  );

  const [displayedRawDexPools, setDisplayedRawDexPools] = useState<Nullable<RawDexPool[]>>(null);
  const { data: rawDexPools, initLoading: dexPoolsLoading } = useWebSocket<RawDexPool[]>(
    DEX_POOLS_URLS[NETWORK_ID],
    setDisplayedRawDexPools,
    handleLoadError
  );
  const displayedDexPools = useMemo(() => {
    const quipuswapRawDexPools = (displayedRawDexPools ?? fallbackRawDexPools).filter(
      ({ dexType }) => dexType === RawDexType.QuipuSwap || dexType === RawDexType.QuipuSwapTokenToTokenDex
    );

    return quipuswapRawDexPools.map(rawDexPool => rawDexToDexPair(rawDexPool, tokens));
  }, [displayedRawDexPools, tokens]);
  const [dataIsStale, setDataIsStale] = useState(false);

  const refreshDexPools = useCallback(
    () => setDisplayedRawDexPools(rawDexPools),
    [setDisplayedRawDexPools, rawDexPools]
  );

  useOnBlock(tezos, () => setDataIsStale(true));
  useEffect(() => setDataIsStale(false), [displayedRawDexPools]);

  const dexGraph = useMemo(() => dexPairsToSwapGraph(displayedDexPools), [displayedDexPools]);

  return {
    dataIsStale,
    refreshDexPools,
    dexGraph,
    dexPools: displayedDexPools,
    dexPoolsLoading
  };
});
