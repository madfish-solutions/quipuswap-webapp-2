import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT } from '@app.config';
import { getTokenIdFromSlug, getTokenSlug, makeToken } from '@utils/helpers';
import { DexGraph } from '@utils/routing';
import { DexPair, DexPairType, Token } from '@utils/types';

import { RawDexPool, RawDexType } from './use-dex-graph.types';

export const rawDexToDexPair = (
  { dexType, dexId, aTokenPool, aTokenSlug, bTokenPool, bTokenSlug, dexAddress }: RawDexPool,
  knownTokens: Token[]
): DexPair => {
  if (dexType === RawDexType.QuipuSwap) {
    return {
      token1Pool: new BigNumber(aTokenPool),
      token2Pool: new BigNumber(bTokenPool),
      token1: makeToken(getTokenIdFromSlug(aTokenSlug), knownTokens),
      token2: makeToken(getTokenIdFromSlug(bTokenSlug), knownTokens),
      id: dexAddress,
      type: DexPairType.TokenToXtz
    };
  }

  return {
    token1Pool: new BigNumber(aTokenPool),
    token2Pool: new BigNumber(bTokenPool),
    token1: makeToken(getTokenIdFromSlug(aTokenSlug), knownTokens),
    token2: makeToken(getTokenIdFromSlug(bTokenSlug), knownTokens),
    id: Number(dexId!),
    type: DexPairType.TokenToToken
  };
};

const withSlug = (dexGraph: DexGraph, tokenSlug: string) => {
  if (!dexGraph[tokenSlug]) {
    return {
      ...dexGraph,
      [tokenSlug]: { edges: {} }
    };
  }

  return dexGraph;
};

export const dexPairsToSwapGraph = (dexPairs: DexPair[]) => {
  const swappablePairs = dexPairs.filter(
    ({ token1Pool, token2Pool }) => !token1Pool.eq(EMPTY_POOL_AMOUNT) && !token2Pool.eq(EMPTY_POOL_AMOUNT)
  );

  return swappablePairs.reduce<DexGraph>((dexGraph, pair) => {
    const token1Slug = getTokenSlug(pair.token1);
    const token2Slug = getTokenSlug(pair.token2);

    dexGraph = withSlug(dexGraph, token1Slug);
    dexGraph[token1Slug].edges[token2Slug] = pair;

    dexGraph = withSlug(dexGraph, token2Slug);
    dexGraph[token2Slug].edges[token1Slug] = pair;

    return dexGraph;
  }, {});
};
