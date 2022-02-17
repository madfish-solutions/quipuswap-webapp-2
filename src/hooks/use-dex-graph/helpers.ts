import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT } from '@app.config';
import { Standard } from '@graphql';
import { getTokenSlug, makeToken } from '@utils/helpers';
import { DexGraph } from '@utils/routing';
import { DexPair, DexPairType, Token } from '@utils/types';

import { RawDexPool, RawDexTokenStandard, RawDexType } from './use-dex-graph.types';

const rawDexPoolTokenSlugToTokenId = (tokenSlug: string, tokenStandard?: RawDexTokenStandard) => {
  const [contractAddress, rawTokenId] = tokenSlug.split('_');

  return {
    fa2TokenId: tokenStandard === RawDexTokenStandard.FA2 ? Number(rawTokenId) : undefined,
    type: tokenStandard === RawDexTokenStandard.FA2 ? Standard.Fa2 : Standard.Fa12,
    contractAddress
  };
};

export const rawDexToDexPair = (
  {
    dexType,
    dexId,
    aTokenPool,
    aTokenSlug,
    aTokenStandard,
    bTokenPool,
    bTokenSlug,
    bTokenStandard,
    dexAddress
  }: RawDexPool,
  knownTokens: Token[]
) => {
  const aTokenId = rawDexPoolTokenSlugToTokenId(aTokenSlug, aTokenStandard);
  const bTokenId = rawDexPoolTokenSlugToTokenId(bTokenSlug, bTokenStandard);

  if (dexType === RawDexType.QuipuSwap) {
    return {
      token1Pool: new BigNumber(aTokenPool),
      token2Pool: new BigNumber(bTokenPool),
      token1: makeToken(aTokenId, knownTokens),
      token2: makeToken(bTokenId, knownTokens),
      id: dexAddress,
      type: DexPairType.TokenToXtz as const
    };
  }

  return {
    token1Pool: new BigNumber(aTokenPool),
    token2Pool: new BigNumber(bTokenPool),
    token1: makeToken(aTokenId, knownTokens),
    token2: makeToken(bTokenId, knownTokens),
    id: Number(dexId!),
    type: DexPairType.TokenToToken as const
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
