import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, isNotFoundError } from '@shared/helpers';

import { useRouteParams } from './hooks/use-route-params';

export const useRouterViewModel = () => {
  const { tezos } = useRootStore();
  const { poolId, positionId } = useRouteParams();
  const store = useLiquidityV3ItemStore();

  useEffect(() => {
    if (isExist(poolId) && tezos) {
      if (isExist(positionId)) {
        store.setPositionId(Number(positionId));
      }
      store.setPoolId(new BigNumber(poolId));
      (async () => {
        try {
          await store.itemSore.load();
        } catch (_error) {
          store.setError(_error as Error);
        }
      })();
    }

    return () => store.itemSore.resetData();
  }, [store, poolId, positionId, tezos]);

  return {
    isLoading: store.itemIsLoading,
    isNotFound: store.error && isNotFoundError(store.error),
    error: store.error
  };
};
