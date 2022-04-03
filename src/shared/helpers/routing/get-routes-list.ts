import { DexPair } from '@shared/types';

import { getTokenSlug } from '../tokens';
import { DexGraph } from './types';

export function getRoutesList(
  startTokenSlug: string,
  endTokenSlug: string,
  graph: DexGraph,
  depth: number,
  prevRoute: DexPair[] = []
): DexPair[][] {
  if (startTokenSlug === endTokenSlug) {
    return [prevRoute];
  }
  if (depth === 0) {
    return [];
  }
  const vertex = graph[startTokenSlug] ?? { edges: {} };

  return Object.entries(vertex.edges).flatMap(([nextTokenSlug, pair]) => {
    if (
      prevRoute.some(({ token1, token2 }) =>
        [token1, token2].some(visitedToken => getTokenSlug(visitedToken) === nextTokenSlug)
      )
    ) {
      return [];
    }

    return getRoutesList(nextTokenSlug, endTokenSlug, graph, depth - 1, [...prevRoute, pair]);
  });
}
