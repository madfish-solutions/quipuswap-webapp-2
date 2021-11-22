import { useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import constate from 'constate';

import {
  useNetwork,
  useOnBlock,
  useTezos,
  useTokens,
} from '@utils/dapp';
import { FACTORIES, POOLS_LIST_API, TEZOS_TOKEN } from '@utils/defaults';
import { DexGraph, getTokenSlug, shortize } from '@utils/helpers';
import { DexPair, QSMainNet, WhitelistedToken } from '@utils/types';
import useUpdateToast from '@hooks/useUpdateToast';
import useContinuousSWR from '@hooks/useContinuousSWR';

type TokenType = 'fa1.2' | 'fa2';

type RawToken = {
  address: string;
  type: TokenType;
  id?: number;
};

type RawCommonPoolData = {
  type: 'ttdex' | 'tokenxtz';
  totalSupply: string;
  tokenAPool: string;
  tokenBPool: string;
  tokenA: RawToken;
};

type RawTTDexPoolData = RawCommonPoolData & {
  type: 'ttdex';
  tokenB: RawToken;
  id: number;
};

type RawTokenXtzPoolData = RawCommonPoolData & {
  type: 'tokenxtz';
  address: string;
  factoryAddress: string;
};

type RawPoolData = RawTTDexPoolData | RawTokenXtzPoolData;

const makeWhitelistedToken = (rawTokenData: RawToken, knownTokens: WhitelistedToken[]) => {
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

const fallbackDexPools: DexPair[] = [];

export const [DexGraphProvider, useDexGraph] = constate(() => {
  const { id: networkId } = useNetwork();
  const { data: tokens } = useTokens();
  const tezos = useTezos();
  const updateToast = useUpdateToast();

  const getDexPools = useCallback(async (): Promise<DexPair[] | undefined> => {
    const { fa1_2Factory: fa12Factory, fa2Factory } = FACTORIES[networkId as QSMainNet];

    try {
      const result = await fetch(`${POOLS_LIST_API}/api/${networkId}/pools`);
      if (result.status >= 400) {
        throw new Error(`Response has status ${result.status}`);
      }
      const rawTTDexPools: RawPoolData[] = await result.json();

      return rawTTDexPools.map(
        (rawPool) => {
          const {
            tokenAPool,
            tokenBPool,
            totalSupply,
            tokenA,
          } = rawPool;
          const token1 = makeWhitelistedToken(tokenA, tokens);
          const token2 = rawPool.type === 'ttdex'
            ? makeWhitelistedToken(rawPool.tokenB, tokens)
            : TEZOS_TOKEN;

          return {
            token1Pool: new BigNumber(tokenAPool),
            token2Pool: new BigNumber(tokenBPool),
            totalSupply: new BigNumber(totalSupply),
            token1,
            token2,
            id: rawPool.type === 'ttdex' ? rawPool.id : rawPool.address,
            factoryAddress: rawPool.type === 'ttdex' ? undefined : rawPool.factoryAddress,
          };
        },
      ).filter(
        ({ factoryAddress }) => !factoryAddress || fa12Factory.includes(
          factoryAddress,
        ) || fa2Factory.includes(factoryAddress),
      );
    } catch (e) {
      console.error(e);
      updateToast({
        type: 'error',
        render: 'Token to token exchangers not loaded',
      });
      return undefined;
    }
  }, [tokens, networkId, updateToast]);

  const tokensSWRKey = useMemo(
    () => tokens.map(getTokenSlug).join(','),
    [tokens],
  );

  const {
    data: dexPools,
    revalidate: updateDexPools,
  } = useContinuousSWR(['dexPools', networkId, tokensSWRKey], getDexPools);
  useOnBlock(tezos, updateDexPools);

  const dexGraph = useMemo(() => (dexPools ?? []).filter(
    ({ token1Pool, token2Pool }) => !token1Pool.eq(0) && !token2Pool.eq(0),
  ).reduce<DexGraph>(
    (graphPart, dexPair) => {
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
    },
    {},
  ),
  [dexPools]);

  return {
    dexGraph,
    dexPools: dexPools ?? fallbackDexPools,
    updateDexPools,
    dexPoolsLoading: !dexPools,
  };
});
