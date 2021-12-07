import memoizee from 'memoizee';

import { DexPair } from '@utils/types';
import {
  getTokenIdFromSlug,
  getMaxTokenInput,
  getTokenOutput,
} from '@utils/helpers';

import { getRoutesList } from './getRoutesList';
import { getCommonRouteProblemMemoKey } from './getCommonRouteProblemMemoKey';
import { CommonRouteProblemParams } from './types';

export const getMaxOutputRoute = memoizee(
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
    const inputToken = getTokenIdFromSlug(startTokenSlug);
    return routes.slice(1).reduce(
      (prevCandidate, route) => {
        try {
          const prevMaxOutputAmount = getTokenOutput({
            inputToken,
            inputAmount: getMaxTokenInput(outputToken, prevCandidate),
            dexChain: prevCandidate,
          });
          const maxOutputAmount = getTokenOutput({
            inputToken,
            inputAmount: getMaxTokenInput(outputToken, route),
            dexChain: route,
          });
          return maxOutputAmount.gt(prevMaxOutputAmount)
            ? route
            : prevCandidate;
        } catch (e) {
          return prevCandidate;
        }
      },
      routes[0],
    );
  },
  { max: 64, normalizer: ([params]) => getCommonRouteProblemMemoKey(params) },
);
