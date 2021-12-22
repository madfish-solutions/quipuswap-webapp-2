import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { getTokenSlug, getTokenIdFromSlug, getMarketQuotient, getTokenOutput } from '@utils/helpers';
import { DexPair } from '@utils/types';

import { DEFAULT_ROUTE_SEARCH_DEPTH } from './constants';
import { getCommonRouteProblemMemoKey } from './get-common-route-problem-memo-key';
import { CommonRouteProblemParams } from './types';

interface RouteWithInputProblemParams extends CommonRouteProblemParams {
  inputAmount?: BigNumber;
}

interface RoutesTreeBranch {
  pair: DexPair;
  child: RoutesTreeNode;
}

interface RoutesTreeNode {
  parent?: RoutesTreeNode;
  amount: BigNumber;
  tokenSlug: string;
  branches: RoutesTreeBranch[];
}

export function getLeaves(tree: RoutesTreeNode): RoutesTreeNode[] {
  if (tree.branches.length === 0) {
    return [tree];
  }

  return tree.branches.map(({ child }) => getLeaves(child)).flat();
}

export const getParentBranch = (child: RoutesTreeNode) =>
  child.parent?.branches.find(({ child: candidateChild }) => candidateChild === child);

export function getRoutesTreeWithInput(
  {
    startTokenSlug,
    endTokenSlug,
    graph,
    depth = DEFAULT_ROUTE_SEARCH_DEPTH,
    inputAmount = new BigNumber(1)
  }: RouteWithInputProblemParams,
  shouldUseImaginaryAmount: boolean,
  parent?: RoutesTreeNode,
  prevRoute: DexPair[] = []
) {
  const node: RoutesTreeNode = {
    parent,
    amount: inputAmount,
    branches: [],
    tokenSlug: startTokenSlug
  };
  if (startTokenSlug !== endTokenSlug && depth > 0) {
    const vertex = graph[startTokenSlug] ?? { edges: {} };
    Object.entries(vertex.edges).forEach(([nextTokenSlug, pair]) => {
      if (
        prevRoute.some(({ token1, token2 }) =>
          [token1, token2].some(visitedToken => getTokenSlug(visitedToken) === nextTokenSlug)
        )
      ) {
        return;
      }
      const inputToken = getTokenIdFromSlug(startTokenSlug);
      try {
        const outputAmount = shouldUseImaginaryAmount
          ? inputAmount.times(getMarketQuotient(inputToken, [pair]))
          : getTokenOutput({
              inputToken,
              inputAmount,
              dexChain: [pair]
            });
        node.branches.push({
          pair,
          child: getRoutesTreeWithInput(
            {
              startTokenSlug: nextTokenSlug,
              endTokenSlug,
              graph,
              depth: depth - 1,
              inputAmount: outputAmount
            },
            shouldUseImaginaryAmount,
            node,
            [...prevRoute, pair]
          )
        });
      } catch (_) {
        // ignore error
      }
    });
  }

  return node;
}

const getRouteWithInputProblemMemoKey = ({ inputAmount, ...commonParams }: RouteWithInputProblemParams) =>
  [inputAmount?.toFixed(), getCommonRouteProblemMemoKey(commonParams)].join(',');

export const getRouteWithInput = memoizee(
  (params: RouteWithInputProblemParams) => {
    const { endTokenSlug, inputAmount } = params;
    const shouldUseImaginaryAmount = !inputAmount || inputAmount.eq(0);
    const tree = getRoutesTreeWithInput(params, shouldUseImaginaryAmount);
    const leaves = getLeaves(tree).filter(({ tokenSlug }) => tokenSlug === endTokenSlug);
    if (leaves.length === 0) {
      return undefined;
    }
    const bestLeaf = leaves
      .slice(1)
      .reduce((prevCandidate, leaf) => (prevCandidate.amount.gte(leaf.amount) ? prevCandidate : leaf), leaves[0]);
    const route: DexPair[] = [];
    let currentNode = bestLeaf;
    while (currentNode.parent) {
      const { pair } = getParentBranch(currentNode)!;
      route.push(pair);
      currentNode = currentNode.parent;
    }
    route.reverse();

    return route;
  },
  { max: 64, normalizer: ([params]) => getRouteWithInputProblemMemoKey(params) }
);
