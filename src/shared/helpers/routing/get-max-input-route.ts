import memoizee from 'memoizee';

import { MAX_HOPS_COUNT } from '@config/config';
import { DexPair, Undefined } from '@shared/types';

import { getMaxTokenInput } from '../dex';
import { getTokenIdFromSlug } from '../tokens/get-token-id-from-slug';
import { getCommonRouteProblemMemoKey } from './get-common-route-problem-memo-key';
import { getRoutesList } from './get-routes-list';
import { CommonRouteProblemParams } from './types';

export const getMaxInputRoute = memoizee(
  ({ startTokenSlug, endTokenSlug, graph, depth = MAX_HOPS_COUNT }: CommonRouteProblemParams): Undefined<DexPair[]> => {
    const routes = getRoutesList(startTokenSlug, endTokenSlug, graph, depth);
    const outputToken = getTokenIdFromSlug(endTokenSlug);

    return routes.slice(1).reduce<DexPair[]>((prevCandidate, route) => {
      try {
        const prevMaxInputAmount = getMaxTokenInput(outputToken, prevCandidate);
        const maxInputAmount = getMaxTokenInput(outputToken, route);

        return maxInputAmount.gt(prevMaxInputAmount) ? route : prevCandidate;
      } catch {
        return prevCandidate;
      }
    }, routes[0]);
  },
  { max: 64, normalizer: ([params]) => getCommonRouteProblemMemoKey(params) }
);
