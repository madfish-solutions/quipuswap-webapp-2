import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { MAX_HOPS_COUNT } from '@app.config';
import { getTokenIdFromSlug, getMaxTokenInput, getTokenOutput, isEmptyArray } from '@utils/helpers';
import { DexPair, Undefined } from '@utils/types';

import { getCommonRouteProblemMemoKey } from './get-common-route-problem-memo-key';
import { getRoutesList } from './get-routes-list';
import { CommonRouteProblemParams } from './types';

const defaultMaxTokenInput = new BigNumber(Infinity);

export const getMaxOutputRoute = memoizee(
  (
    { startTokenSlug, endTokenSlug, graph, depth = MAX_HOPS_COUNT }: CommonRouteProblemParams,
    maxTokenInput = defaultMaxTokenInput
  ): Undefined<DexPair[]> => {
    const routes = getRoutesList(startTokenSlug, endTokenSlug, graph, depth);
    const outputToken = getTokenIdFromSlug(endTokenSlug);
    const inputToken = getTokenIdFromSlug(startTokenSlug);

    if (isEmptyArray(routes)) {
      return undefined;
    }

    const getRouteTokenOutput = (dexChain: DexPair[]) =>
      getTokenOutput({
        inputToken,
        inputAmount: BigNumber.min(getMaxTokenInput(outputToken, dexChain), maxTokenInput),
        dexChain
      });

    const [firstRoute, ...restRoutes] = routes;

    return restRoutes.reduce(
      ({ bestOutputAmount, bestRoute }, route) => {
        try {
          const currentMaxOutputAmount = getRouteTokenOutput(route);

          if (currentMaxOutputAmount.gt(bestOutputAmount)) {
            return {
              bestRoute: route,
              bestOutputAmount: currentMaxOutputAmount
            };
          }
        } catch (_) {
          // return statement is below
        }

        return { bestOutputAmount, bestRoute };
      },
      { bestRoute: firstRoute, bestOutputAmount: getRouteTokenOutput(firstRoute) }
    ).bestRoute;
  },
  { max: 64, normalizer: ([params]) => getCommonRouteProblemMemoKey(params) }
);
