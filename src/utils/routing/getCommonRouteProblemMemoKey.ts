import { CommonRouteProblemParams } from './types';

export const getCommonRouteProblemMemoKey = ({
  startTokenSlug,
  endTokenSlug,
  graph,
}: CommonRouteProblemParams) => [
  startTokenSlug,
  endTokenSlug,
  JSON.stringify(
    Object.entries(graph)
      .map(([tokenSlug, vertex]) => [
        tokenSlug,
        Object.entries(vertex.edges).map(([token2, edge]) => [
          token2,
          [edge.id, edge.token1Pool.toFixed(), edge.token2Pool.toFixed()],
        ]),
      ]),
  ),
].join(',');
