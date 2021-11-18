import { useCallback, useMemo, useState } from 'react';
import { findDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import constate from 'constate';

import {
  useNetwork,
  useOnBlock,
  useTezos,
  useTokens,
} from '@utils/dapp';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { DexGraph, getTokenSlug, shortize } from '@utils/helpers';
import { DexPair, QSMainNet, WhitelistedToken } from '@utils/types';
import useUpdateToast from '@hooks/useUpdateToast';
import useContinuousSWR from '@hooks/useContinuousSWR';

type RawTTDexPool = {
  id: number;
  tokenAPool: string;
  tokenBPool: string;
  totalSupply: string;
  tokenAType: 'fa1.2' | 'fa2';
  tokenBType: 'fa1.2' | 'fa2';
  tokenAAddress: string;
  tokenBAddress: string;
  tokenAId?: number;
  tokenBId?: number;
};

type RawTokenData = {
  type: RawTTDexPool['tokenAType'];
  address: RawTTDexPool['tokenAAddress'];
  id?: RawTTDexPool['tokenAId'];
};

const makeWhitelistedToken = (rawTokenData: RawTokenData, knownTokens: WhitelistedToken[]) => {
  const { id, address, type } = rawTokenData;
  const matchingToken = knownTokens.find(
    ({
      fa2TokenId,
      contractAddress,
    }) => (contractAddress === address) && fa2TokenId === id,
  );
  const fallbackSymbol = type === 'fa1.2' ? shortize(address) : `${shortize(address)}_${id}`;
  const fallbackToken = {
    type,
    contractAddress: address,
    fa2TokenId: id,
    metadata: {
      decimals: 0,
      symbol: fallbackSymbol,
      name: fallbackSymbol,
      thumbnailUri: '',
    },
  };
  return matchingToken ?? fallbackToken;
};

export const [DexGraphProvider, useDexGraph] = constate(() => {
  const { ttDexApi, id: networkId } = useNetwork();
  const { data: tokens } = useTokens();
  const tezos = useTezos();
  const updateToast = useUpdateToast();

  const getTTDexPools = useCallback(async (): Promise<DexGraph | undefined> => {
    if (!ttDexApi) {
      return {};
    }
    try {
      const result = await fetch(ttDexApi);
      if (result.status >= 400) {
        throw new Error(`Response has status ${result.status}`);
      }
      const rawTTDexPools: RawTTDexPool[] = await result.json();
      return rawTTDexPools.map(
        ({
          tokenAPool,
          tokenBPool,
          totalSupply,
          tokenAType,
          tokenBType,
          tokenAAddress,
          tokenBAddress,
          tokenAId,
          tokenBId,
          id,
        }) => {
          const token1 = makeWhitelistedToken(
            {
              type: tokenAType,
              address: tokenAAddress,
              id: tokenAId,
            },
            tokens,
          );
          const token2 = makeWhitelistedToken(
            {
              type: tokenBType,
              address: tokenBAddress,
              id: tokenBId,
            },
            tokens,
          );

          return {
            token1Pool: new BigNumber(tokenAPool),
            token2Pool: new BigNumber(tokenBPool),
            totalSupply: new BigNumber(totalSupply),
            token1,
            token2,
            id: +id,
          };
        },
      ).reduce<DexGraph>((graphPart, dexPair) => {
        /* eslint-disable no-param-reassign */
        const token1Slug = getTokenSlug(dexPair.token1);
        const token2Slug = getTokenSlug(dexPair.token2);
        if (!graphPart[token1Slug]) {
          graphPart[token1Slug] = { edges: {} };
        }
        if (!graphPart[token2Slug]) {
          graphPart[token2Slug] = { edges: {} };
        }
        graphPart[token1Slug].edges[token2Slug] = dexPair;
        graphPart[token2Slug].edges[token1Slug] = dexPair;

        return graphPart;
        /* eslint-enable no-param-reassign */
      }, {});
    } catch (e) {
      console.error(e);
      updateToast({
        type: 'error',
        render: 'Token to token exchangers not loaded',
      });
      return undefined;
    }
  }, [tokens, ttDexApi, updateToast]);

  const tokensSWRKey = useMemo(
    () => tokens.map(getTokenSlug).join(','),
    [tokens],
  );

  const {
    data: ttDexGraph,
    revalidate: updateTTDexGraph,
  } = useContinuousSWR(
    ['ttdexPools', ttDexApi, tokensSWRKey],
    getTTDexPools,
  );
  useOnBlock(tezos, updateTTDexGraph);

  const [tokenToXtzDexGraph, setTokenToXtzDexGraph] = useState<DexGraph>({});
  const [tokenToXtzPartLoading, setTokenToXtzPartLoading] = useState(false);

  const updateTokenToXtzDexGraphPart = useCallback(
    async (token: WhitelistedToken) => {
      setTokenToXtzPartLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { fa1_2Factory, fa2Factory } = FACTORIES[networkId as QSMainNet];
        const { contractAddress, fa2TokenId } = token;
        const foundDex = await findDex(
          tezos!,
          { fa1_2Factory, fa2Factory },
          { contract: contractAddress, id: fa2TokenId },
        );

        const {
          contract,
          storage: {
            storage: {
              tez_pool: token1Pool,
              token_pool: token2Pool,
              total_supply: totalSupply,
            },
          },
        } = foundDex;
        const pair: DexPair = {
          token1: TEZOS_TOKEN,
          token2: token,
          token1Pool,
          token2Pool,
          id: contract.address,
          totalSupply,
        };
        setTokenToXtzDexGraph(
          (prevGraph) => {
            const newGraph = { ...prevGraph };
            const tokenSlug = getTokenSlug(token);

            if (!newGraph.tez) {
              newGraph.tez = { edges: {} };
            }
            if (!newGraph[tokenSlug]) {
              newGraph[tokenSlug] = { edges: {} };
            }
            newGraph.tez.edges[tokenSlug] = pair;
            newGraph[tokenSlug].edges.tez = pair;

            return newGraph;
          },
        );
      } catch (e) {
        console.error(e);
      } finally {
        setTokenToXtzPartLoading(false);
      }
    },
    [networkId, tezos],
  );

  const dexGraph = useMemo(
    () => {
      const result: DexGraph = {};
      [ttDexGraph ?? {}, tokenToXtzDexGraph].forEach(
        (graph) => {
          Object.entries(graph).forEach(
            ([token1Slug, { edges }]) => {
              Object.entries(edges).forEach(
                ([token2Slug, pair]) => {
                  if (pair.totalSupply.eq(0)) {
                    return;
                  }
                  if (!result[token1Slug]) {
                    result[token1Slug] = { edges: {} };
                  }
                  result[token1Slug].edges[token2Slug] = pair;
                },
              );
            },
          );
        },
      );

      return result;
    },
    [ttDexGraph, tokenToXtzDexGraph],
  );

  return {
    dexGraph,
    updateTokenToXtzDexGraphPart,
    ttDexGraphLoading: !ttDexGraph,
    tokenToXtzPartLoading,
  };
});
