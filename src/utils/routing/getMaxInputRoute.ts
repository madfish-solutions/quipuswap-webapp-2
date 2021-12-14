import memoizee from 'memoizee';

import { DexPair } from '@utils/types';
import { getTokenIdFromSlug, getMaxTokenInput } from '@utils/helpers';

import { getRoutesList } from './getRoutesList';
import { getCommonRouteProblemMemoKey } from './getCommonRouteProblemMemoKey';
import { CommonRouteProblemParams } from './types';

export const getMaxInputRoute = memoizee(
  ({
    startTokenSlug,
    endTokenSlug,
    graph,
    depth = 5,
  }: CommonRouteProblemParams): DexPair[] | undefined => {
    const routes = getRoutesList(
      startTokenSlug,
      endTokenSlug,
      graph,
      depth,
    );
    const outputToken = getTokenIdFromSlug(endTokenSlug);
    return routes.slice(1).reduce<DexPair[]>(
      (prevCandidate, route) => {
        try {
          const prevMaxInputAmount = getMaxTokenInput(outputToken, prevCandidate);
          const maxInputAmount = getMaxTokenInput(outputToken, route);

          return maxInputAmount.gt(prevMaxInputAmount) ? route : prevCandidate;
        } catch {
          return prevCandidate;
        }
      },
      routes[0],
    );
  },
  { max: 64, normalizer: ([params]) => getCommonRouteProblemMemoKey(params) },
);
