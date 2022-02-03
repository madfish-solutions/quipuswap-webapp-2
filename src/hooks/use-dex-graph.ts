import { useCallback, useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';
import useSWR, { useSWRConfig } from 'swr';

import { FACTORIES, NETWORK_ID, POOLS_LIST_API, TEZOS_TOKEN } from '@app.config';
import { Standard } from '@graphql';
import { useOnBlock, useTezos, useTokens } from '@utils/dapp';
import { getTokenSlug, makeWhitelistedToken } from '@utils/helpers';
import { DexGraph } from '@utils/routing';
import { DexPair, DexPairType } from '@utils/types';

import { useToasts } from './use-toasts';

interface RawToken {
  address: string;
  type: Standard;
  id?: string;
}

interface RawCommonPoolData {
  type: DexPairType;
  totalSupply: string;
  tokenAPool: string;
  tokenBPool: string;
  tokenA: RawToken;
}

interface RawTTDexPoolData extends RawCommonPoolData {
  type: DexPairType.ttdex;
  tokenB: RawToken;
  id: number;
}

interface RawTokenXtzPoolData extends RawCommonPoolData {
  type: DexPairType.tokenxtz;
  address: string;
  factoryAddress: string;
}

type RawPoolData = RawTTDexPoolData | RawTokenXtzPoolData;

const fallbackDexPools: DexPair[] = [];

export const [DexGraphProvider, useDexGraph] = constate(() => {
  const [dataIsStale, setDataIsStale] = useState(false);
  const { data: tokens } = useTokens();
  const tezos = useTezos();
  const { showErrorToast } = useToasts();
  const { mutate } = useSWRConfig();

  const getDexPools = useCallback(async (): Promise<DexPair[] | undefined> => {
    const { fa1_2Factory: fa12Factory, fa2Factory } = FACTORIES[NETWORK_ID];

    try {
      const result = await fetch(`${POOLS_LIST_API}/api/${NETWORK_ID}/pools`);
      if (result.status >= 400) {
        throw new Error(`Response has status ${result.status}`);
      }
      const rawTTDexPools: RawPoolData[] = await result.json();

      return rawTTDexPools
        .map(rawPool => {
          const { tokenAPool, tokenBPool, totalSupply, tokenA } = rawPool;
          const token1 = makeWhitelistedToken(
            {
              contractAddress: tokenA.address,
              type: tokenA.type,
              fa2TokenId: tokenA.id === undefined ? undefined : Number(tokenA.id)
            },
            tokens
          );
          const token2 =
            rawPool.type === DexPairType.ttdex
              ? makeWhitelistedToken(
                  {
                    contractAddress: rawPool.tokenB.address,
                    type: rawPool.tokenB.type,
                    fa2TokenId: rawPool.tokenB.id === undefined ? undefined : Number(rawPool.tokenB.id)
                  },
                  tokens
                )
              : TEZOS_TOKEN;

          const commonPoolProps = {
            token1Pool: new BigNumber(tokenAPool),
            token2Pool: new BigNumber(tokenBPool),
            totalSupply: new BigNumber(totalSupply),
            token1,
            token2
          };

          return rawPool.type === DexPairType.ttdex
            ? {
                ...commonPoolProps,
                id: rawPool.id,
                type: DexPairType.ttdex as const
              }
            : {
                ...commonPoolProps,
                id: rawPool.address,
                factoryAddress: rawPool.factoryAddress,
                type: DexPairType.tokenxtz as const
              };
        })
        .filter(
          pool =>
            pool.type === DexPairType.ttdex ||
            fa12Factory.includes(pool.factoryAddress) ||
            fa2Factory.includes(pool.factoryAddress)
        );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      showErrorToast('Token to token exchangers not loaded');

      return undefined;
    }
  }, [tokens, showErrorToast]);

  const tokensSWRKey = useMemo(() => tokens.map(getTokenSlug).join(','), [tokens]);

  const { data: dexPools, error: dexPoolsError, isValidating } = useSWR(['dexPools', tokensSWRKey], getDexPools);
  const refreshDexPools = async () => mutate(['dexPools', tokensSWRKey]);

  useOnBlock(tezos, () => setDataIsStale(true));
  useEffect(() => setDataIsStale(false), [dexPools]);

  const dexGraph = useMemo(
    () =>
      (dexPools ?? [])
        .filter(({ token1Pool, token2Pool }) => !token1Pool.eq(0) && !token2Pool.eq(0))
        .reduce<DexGraph>((graphPart, dexPair) => {
          const token1Slug = getTokenSlug(dexPair.token1);
          const token2Slug = getTokenSlug(dexPair.token2);
          const previousToken1Edges = graphPart[token1Slug]?.edges ?? {};
          const previousToken2Edges = graphPart[token2Slug]?.edges ?? {};

          return {
            ...graphPart,
            [token1Slug]: {
              edges: {
                ...previousToken1Edges,
                [token2Slug]: dexPair
              }
            },
            [token2Slug]: {
              edges: {
                ...previousToken2Edges,
                [token1Slug]: dexPair
              }
            }
          };
        }, {}),
    [dexPools]
  );

  return {
    dataIsStale,
    refreshDexPools,
    dexGraph,
    dexPools: dexPools ?? fallbackDexPools,
    dexPoolsLoading: (!dexPools && !dexPoolsError) || isValidating
  };
});
