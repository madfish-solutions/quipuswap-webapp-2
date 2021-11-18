import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { DexPair } from '@utils/types';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import {
  getMarketQuotient,
  getMaxTokenInput,
  getTokenInput,
  getTokenOutput,
} from '@utils/helpers/token-to-token-dex';

type Vertex = {
  edges: Record<string, DexPair>;
};

export type DexGraph = Record<string, Vertex>;

export type Routes = Record<string, DexPair[]>;

type CommonRouteProblemParams = {
  startTokenSlug: string;
  endTokenSlug: string;
  graph: DexGraph;
  depth?: number;
};

type RouteWithInputProblemParams = CommonRouteProblemParams & {
  inputAmount?: BigNumber;
};

type RouteWithOutputProblemParams = CommonRouteProblemParams & {
  outputAmount?: BigNumber;
};

type RoutesTreeBranch = {
  pair: DexPair;
  child: RoutesTreeNode;
};

type RoutesTreeNode = {
  parent?: RoutesTreeNode;
  amount: BigNumber;
  tokenSlug: string;
  branches: RoutesTreeBranch[];
};

type SerializableRoutesTreeBranch = {
  pair: DexPair;
  child: SerializableRoutesTreeNode;
};

type SerializableRoutesTreeNode = {
  parent?: string;
  amount: BigNumber;
  tokenSlug: string;
  branches: SerializableRoutesTreeBranch[];
};

const getCommonRouteProblemMemoKey = ({
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

const getRouteWithInputProblemMemoKey = ({
  inputAmount,
  ...commonParams
}: RouteWithInputProblemParams) => [
  inputAmount?.toFixed(),
  getCommonRouteProblemMemoKey(commonParams),
].join(',');

const getRouteWithOutputProblemMemoKey = ({
  outputAmount,
  ...commonParams
}: RouteWithOutputProblemParams) => [
  outputAmount?.toFixed(),
  getCommonRouteProblemMemoKey(commonParams),
].join(',');

function makeRoutesTree(
  startTokenSlug: string,
  endTokenSlug: string,
  graph: DexGraph,
  depth: number,
  fillValue = new BigNumber(0),
  parent?: RoutesTreeNode,
  prevRoute: DexPair[] = [],
) {
  const node: RoutesTreeNode = {
    parent,
    amount: fillValue,
    branches: [],
    tokenSlug: startTokenSlug,
  };
  if ((startTokenSlug !== endTokenSlug) && depth > 0) {
    const vertex = graph[startTokenSlug] ?? { edges: {} };
    Object.entries(vertex.edges).forEach(([nextTokenSlug, pair]) => {
      if (prevRoute.some(
        ({ token1, token2 }) => [token1, token2].some(
          (visitedToken) => getTokenSlug(visitedToken) === nextTokenSlug,
        ),
      )) {
        return;
      }
      node.branches.push({
        pair,
        child: makeRoutesTree(
          nextTokenSlug,
          endTokenSlug,
          graph,
          depth - 1,
          fillValue,
          node,
          [...prevRoute, pair],
        ),
      });
    });
  }
  return node;
}

function makeRoutesList(
  startTokenSlug: string,
  endTokenSlug: string,
  graph: DexGraph,
  depth: number,
  prevRoute: DexPair[] = [],
): DexPair[][] {
  if (startTokenSlug === endTokenSlug) {
    return [prevRoute];
  }
  if (depth === 0) {
    return [];
  }
  const vertex = graph[startTokenSlug] ?? { edges: {} };
  return Object.entries(vertex.edges).map(([nextTokenSlug, pair]) => {
    if (prevRoute.some(
      ({ token1, token2 }) => [token1, token2].some(
        (visitedToken) => getTokenSlug(visitedToken) === nextTokenSlug,
      ),
    )) {
      return [];
    }
    return makeRoutesList(
      nextTokenSlug,
      endTokenSlug,
      graph,
      depth - 1,
      [...prevRoute, pair],
    );
  }).flat(1);
}

function getLeaves(tree: RoutesTreeNode): RoutesTreeNode[] {
  if (tree.branches.length === 0) {
    return [tree];
  }
  return tree.branches.map(({ child }) => getLeaves(child)).flat();
}

function fillRoutesTreeWithInput(
  tree: RoutesTreeNode,
  inputAmount: BigNumber,
  shouldUseImaginaryAmount: boolean,
) {
  // eslint-disable-next-line no-param-reassign
  tree.amount = inputAmount;
  const inputToken = getTokenIdFromSlug(tree.tokenSlug);
  tree.branches.forEach(({ child, pair }) => {
    try {
      const outputAmount = shouldUseImaginaryAmount
        ? inputAmount.times(getMarketQuotient(inputToken, [pair]))
        : getTokenOutput({
          inputToken,
          inputAmount,
          dexChain: [pair],
        });
      fillRoutesTreeWithInput(child, outputAmount, shouldUseImaginaryAmount);
      // eslint-disable-next-line no-empty
    } catch {}
  });
}

export const getRouteWithInput = memoizee(
  ({
    startTokenSlug,
    endTokenSlug,
    graph,
    inputAmount,
    depth = 5,
  }: RouteWithInputProblemParams) => {
    const tree = makeRoutesTree(startTokenSlug, endTokenSlug, graph, depth);
    const shouldUseImaginaryAmount = !inputAmount || inputAmount.eq(0);
    fillRoutesTreeWithInput(
      tree,
      shouldUseImaginaryAmount ? new BigNumber(1) : inputAmount!,
      shouldUseImaginaryAmount,
    );
    const leaves = getLeaves(tree).filter(({ tokenSlug }) => tokenSlug === endTokenSlug);
    if (leaves.length === 0) {
      return undefined;
    }
    const bestLeaf = leaves.slice(1).reduce(
      (prevCandidate, leaf) => (prevCandidate.amount.gte(leaf.amount) ? prevCandidate : leaf),
      leaves[0],
    );
    const route: DexPair[] = [];
    let currentNode = bestLeaf;
    while (currentNode.parent) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const { pair } = currentNode.parent.branches.find(({ child }) => child === currentNode)!;
      route.push(pair);
      currentNode = currentNode.parent;
    }
    route.reverse();
    return route;
  },
  { max: 64, normalizer: ([params]) => getRouteWithInputProblemMemoKey(params) },
);

export const getRouteWithOutput = memoizee(
  ({
    startTokenSlug,
    endTokenSlug,
    graph,
    outputAmount,
    depth = 5,
  }: RouteWithOutputProblemParams) => {
    const routes = makeRoutesList(
      startTokenSlug,
      endTokenSlug,
      graph,
      depth,
    );
    const outputToken = getTokenIdFromSlug(endTokenSlug);
    const inputToken = getTokenIdFromSlug(startTokenSlug);
    return routes.reduce<DexPair[] | undefined>(
      (prevCandidate, route) => {
        try {
          let prevInputAmount = prevCandidate === undefined
            ? new BigNumber(Infinity)
            : new BigNumber(1).div(getMarketQuotient(inputToken, prevCandidate));
          let inputAmount = new BigNumber(1).div(getMarketQuotient(inputToken, route));
          if (outputAmount) {
            prevInputAmount = prevCandidate === undefined
              ? new BigNumber(Infinity)
              : getTokenInput(outputToken, outputAmount, prevCandidate);
            inputAmount = getTokenInput(outputToken, outputAmount, route);
          }
          return inputAmount.lt(prevInputAmount) ? route : prevCandidate;
        } catch {
          return prevCandidate;
        }
      },
      undefined,
    );
  },
  { max: 64, normalizer: ([params]) => getRouteWithOutputProblemMemoKey(params) },
);

export const getMaxInputRoute = memoizee(
  ({
    startTokenSlug,
    endTokenSlug,
    graph,
    depth = 5,
  }: CommonRouteProblemParams): DexPair[] | undefined => {
    const routes = makeRoutesList(
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

export const getMaxOutputRoute = memoizee(
  ({
    startTokenSlug,
    endTokenSlug,
    graph,
    depth = 5,
  }: CommonRouteProblemParams): DexPair[] | undefined => {
    const routes = makeRoutesList(
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
