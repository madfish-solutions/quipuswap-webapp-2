import { useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { useNetwork, useTezos, useTokens } from '@utils/dapp';
import { FACTORIES, POOLS_LIST_API, TEZOS_TOKEN } from '@utils/defaults';
import { getTokenSlug, makeWhitelistedToken } from '@utils/helpers';
import { DexGraph } from '@utils/routing';
import { DexPair } from '@utils/types';

import useUpdateOnBlockSWR from './useUpdateOnBlockSWR';
import { useFlowToasts } from './use-flow-toasts';

type TokenType = 'fa1.2' | 'fa2';

interface RawToken {
  address: string;
  type: TokenType;
  id?: string;
}

interface RawCommonPoolData {
  type: 'ttdex' | 'tokenxtz';
  totalSupply: string;
  tokenAPool: string;
  tokenBPool: string;
  tokenA: RawToken;
}

interface RawTTDexPoolData extends RawCommonPoolData {
  type: 'ttdex';
  tokenB: RawToken;
  id: number;
}

interface RawTokenXtzPoolData extends RawCommonPoolData {
  type: 'tokenxtz';
  address: string;
  factoryAddress: string;
}

type RawPoolData = RawTTDexPoolData | RawTokenXtzPoolData;

const fallbackDexPools: DexPair[] = [];

export const [DexGraphProvider, useDexGraph] = constate(() => {
  const { id: networkId } = useNetwork();
  const { data: tokens } = useTokens();
  const tezos = useTezos();
  const {showErrorToast} = useFlowToasts();

  const getDexPools = useCallback(async (): Promise<DexPair[] | undefined> => {
    const { fa1_2Factory: fa12Factory, fa2Factory } = FACTORIES[networkId];

    try {
      const result = await fetch(`${POOLS_LIST_API}/api/${networkId}/pools`);
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
            rawPool.type === 'ttdex'
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

          return rawPool.type === 'ttdex'
            ? {
                ...commonPoolProps,
                id: rawPool.id,
                type: 'ttdex' as const
              }
            : {
                ...commonPoolProps,
                id: rawPool.address,
                factoryAddress: rawPool.factoryAddress,
                type: 'tokenxtz' as const
              };
        })
        .filter(
          pool =>
            pool.type === 'ttdex' ||
            fa12Factory.includes(pool.factoryAddress) ||
            fa2Factory.includes(pool.factoryAddress)
        );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      showErrorToast('Token to token exchangers not loaded')

      return undefined;
    }
  }, [tokens, networkId, showErrorToast]);

  const tokensSWRKey = useMemo(() => tokens.map(getTokenSlug).join(','), [tokens]);

  const { data: dexPools, error: dexPoolsError } = useUpdateOnBlockSWR(
    tezos,
    ['dexPools', networkId, tokensSWRKey],
    getDexPools
  );

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
    dexGraph,
    dexPools: dexPools ?? fallbackDexPools,
    dexPoolsLoading: !dexPools && !dexPoolsError
  };
});
