import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { DEX_POOLS_URLS, NETWORK_ID } from '@app.config';
import { useWebSocket } from '@hooks/use-web-socket';
import { useOnBlock, useTezos, useTokens } from '@utils/dapp';
import { getTokenIdFromSlug, getTokenSlug, makeWhitelistedToken } from '@utils/helpers';
import { DexGraph } from '@utils/routing';
import { DexPair } from '@utils/types';

import { RawDexPool, RawDexType } from './use-dex-graph.types';

const fallbackRawDexPools: RawDexPool[] = [];

export const [DexGraphProvider, useDexGraph] = constate(() => {
  const [dataIsStale, setDataIsStale] = useState(false);
  const { data: tokens } = useTokens();
  const tezos = useTezos();

  const { data: rawDexPools, loading: dexPoolsLoading } = useWebSocket(DEX_POOLS_URLS[NETWORK_ID], fallbackRawDexPools);
  const prevDexPoolsLoadingRef = useRef(dexPoolsLoading);
  const dexPools = useMemo(
    () =>
      rawDexPools
        .filter(({ dexType }) => dexType === RawDexType.QuipuSwap || dexType === RawDexType.QuipuSwapTokenToTokenDex)
        .map(({ dexType, aTokenPool, aTokenSlug, bTokenPool, bTokenSlug, dexAddress, dexId }): DexPair => {
          if (dexType === RawDexType.QuipuSwap) {
            return {
              token1Pool: new BigNumber(aTokenPool),
              token2Pool: new BigNumber(bTokenPool),
              token1: makeWhitelistedToken(getTokenIdFromSlug(aTokenSlug), tokens),
              token2: makeWhitelistedToken(getTokenIdFromSlug(bTokenSlug), tokens),
              id: dexAddress,
              type: 'tokenxtz'
            };
          }

          return {
            token1Pool: new BigNumber(aTokenPool),
            token2Pool: new BigNumber(bTokenPool),
            token1: makeWhitelistedToken(getTokenIdFromSlug(aTokenSlug), tokens),
            token2: makeWhitelistedToken(getTokenIdFromSlug(bTokenSlug), tokens),
            id: Number(dexId!),
            type: 'ttdex'
          };
        }),
    [rawDexPools, tokens]
  );
  const [displayedDexPools, setDisplayedDexPools] = useState(dexPools);
  const refreshDexPools = useCallback(() => setDisplayedDexPools(dexPools), [setDisplayedDexPools, dexPools]);

  useEffect(() => {
    if (prevDexPoolsLoadingRef.current && !dexPoolsLoading) {
      refreshDexPools();
    }
    prevDexPoolsLoadingRef.current = dexPoolsLoading;
  }, [dexPoolsLoading, refreshDexPools]);

  useOnBlock(tezos, () => setDataIsStale(true));
  useEffect(() => setDataIsStale(false), [displayedDexPools]);

  const dexGraph = useMemo(
    () =>
      (displayedDexPools ?? [])
        .filter(({ token1Pool, token2Pool }) => !token1Pool.eq(0) && !token2Pool.eq(0))
        .reduce<DexGraph>((graphPart, dexPair) => {
          const token1Slug = getTokenSlug(dexPair.token1);
          const token2Slug = getTokenSlug(dexPair.token2);
          const previousToken1Edges = graphPart[token1Slug]?.edges ?? {};
          const previousToken2Edges = graphPart[token2Slug]?.edges ?? {};

          return {
            ...graphPart,
            [token1Slug]: {
              edges: {
                ...previousToken1Edges,
                [token2Slug]: dexPair
              }
            },
            [token2Slug]: {
              edges: {
                ...previousToken2Edges,
                [token1Slug]: dexPair
              }
            }
          };
        }, {}),
    [displayedDexPools]
  );

  return {
    dataIsStale,
    refreshDexPools,
    dexGraph,
    dexPools: displayedDexPools,
    dexPoolsLoading
  };
});
