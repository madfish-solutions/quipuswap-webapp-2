import { useCallback, useMemo, useState } from 'react';

import constate from 'constate';

import { DEX_POOL_URL } from '@config/enviroment';
import { useTokens } from '@providers/dapp-tokens';
import { Nullable } from '@shared/types';

import { amplitudeService } from '../../services';
import { useToasts } from '../use-toasts';
import { useWebSocket } from '../use-web-socket';
import { dexPairsToSwapGraph, rawDexToDexPair } from './helpers';
import { RawDexPool, RawDexPoolsResponse, RawDexType } from './use-dex-graph.types';

const fallbackRawDexPools: RawDexPool[] = [];

export const [DexGraphProvider, useDexGraph] = constate(() => {
  const { data: tokens } = useTokens();
  const { showErrorToast } = useToasts();

  const handleLoadError = useCallback(
    () => showErrorToast(`An error occurred while loading exchange rates`),
    [showErrorToast]
  );

  const [displayedRawDexPools, setDisplayedRawDexPools] = useState<Nullable<RawDexPool[]>>(null);
  const handleSuccess = useCallback((response: RawDexPoolsResponse) => {
    setDisplayedRawDexPools(response.routePairs);
  }, []);
  const { data: rawDexPoolsResponse, initLoading: dexPoolsLoading } = useWebSocket<RawDexPoolsResponse>(
    DEX_POOL_URL,
    handleSuccess,
    handleLoadError
  );
  const rawDexPools = rawDexPoolsResponse?.routePairs ?? null;
  const displayedDexPools = useMemo(() => {
    const quipuswapRawDexPools = (displayedRawDexPools ?? fallbackRawDexPools).filter(
      ({ dexType }) => dexType === RawDexType.QuipuSwap || dexType === RawDexType.QuipuSwapTokenToTokenDex
    );

    return quipuswapRawDexPools.map(rawDexPool => rawDexToDexPair(rawDexPool, tokens));
  }, [displayedRawDexPools, tokens]);

  const refreshDexPools = useCallback(() => {
    amplitudeService.logEvent('UPDATE_RATES_CLICK');

    return setDisplayedRawDexPools(rawDexPools);
  }, [rawDexPools]);

  const dataIsStale = displayedRawDexPools !== rawDexPools;

  const dexGraph = useMemo(() => dexPairsToSwapGraph(displayedDexPools), [displayedDexPools]);

  return {
    dataIsStale,
    refreshDexPools,
    dexGraph,
    dexPools: displayedDexPools,
    dexPoolsLoading
  };
});
