import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { MAX_HOPS_COUNT } from '@app.config';
import { DexPair, Undefined } from '@interfaces/types';
import { getTokenIdFromSlug, getMarketQuotient, getTokenInput } from '@utils/helpers';

import { getCommonRouteProblemMemoKey } from './get-common-route-problem-memo-key';
import { getRoutesList } from './get-routes-list';
import { CommonRouteProblemParams } from './types';

interface RouteWithOutputProblemParams extends CommonRouteProblemParams {
  outputAmount?: BigNumber;
}

const getRouteWithOutputProblemMemoKey = ({ outputAmount, ...commonParams }: RouteWithOutputProblemParams) =>
  [outputAmount?.toFixed(), getCommonRouteProblemMemoKey(commonParams)].join(',');

export const getRouteWithOutput = memoizee(
  ({ startTokenSlug, endTokenSlug, graph, outputAmount, depth = MAX_HOPS_COUNT }: RouteWithOutputProblemParams) => {
    const routes = getRoutesList(startTokenSlug, endTokenSlug, graph, depth);
    const outputToken = getTokenIdFromSlug(endTokenSlug);
    const inputToken = getTokenIdFromSlug(startTokenSlug);

    return routes.reduce<Undefined<DexPair[]>>((prevCandidate, route) => {
      try {
        let prevInputAmount =
          prevCandidate === undefined
            ? new BigNumber(Infinity)
            : new BigNumber(1).div(getMarketQuotient(inputToken, prevCandidate));
        let inputAmount = new BigNumber(1).div(getMarketQuotient(inputToken, route));
        if (outputAmount) {
          prevInputAmount =
            prevCandidate === undefined
              ? new BigNumber(Infinity)
              : getTokenInput(outputToken, outputAmount, prevCandidate);
          inputAmount = getTokenInput(outputToken, outputAmount, route);
        }

        return inputAmount.lt(prevInputAmount) ? route : prevCandidate;
      } catch {
        return prevCandidate;
      }
    }, undefined);
  },
  { max: 64, normalizer: ([params]) => getRouteWithOutputProblemMemoKey(params) }
);
