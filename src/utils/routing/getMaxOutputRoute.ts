import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { getTokenIdFromSlug, getMaxTokenInput, getTokenOutput } from '@utils/helpers';
import { DexPair } from '@utils/types';

import { getCommonRouteProblemMemoKey } from './getCommonRouteProblemMemoKey';
import { getRoutesList } from './getRoutesList';
import { CommonRouteProblemParams } from './types';

const defaultMaxTokenInput = new BigNumber(Infinity);

export const getMaxOutputRoute = memoizee(
  (
    { startTokenSlug, endTokenSlug, graph, depth = 5 }: CommonRouteProblemParams,
    maxTokenInput = defaultMaxTokenInput
  ): DexPair[] | undefined => {
    const routes = getRoutesList(startTokenSlug, endTokenSlug, graph, depth);
    const outputToken = getTokenIdFromSlug(endTokenSlug);
    const inputToken = getTokenIdFromSlug(startTokenSlug);
    return routes.slice(1).reduce((prevCandidate, route) => {
      try {
        const prevMaxOutputAmount = getTokenOutput({
          inputToken,
          inputAmount: BigNumber.max(getMaxTokenInput(outputToken, prevCandidate), maxTokenInput),
          dexChain: prevCandidate
        });
        const maxOutputAmount = getTokenOutput({
          inputToken,
          inputAmount: BigNumber.max(getMaxTokenInput(outputToken, route), maxTokenInput),
          dexChain: route
        });
        return maxOutputAmount.gt(prevMaxOutputAmount) ? route : prevCandidate;
      } catch (e) {
        return prevCandidate;
      }
    }, routes[0]);
  },
  { max: 64, normalizer: ([params]) => getCommonRouteProblemMemoKey(params) }
);
