import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, isNotFoundError, onlyDigits } from '@shared/helpers';

import { useRouteParams } from './hooks/use-route-params';

export const useRouterViewModel = () => {
  const { tezos } = useRootStore();
  const { id } = useRouteParams();
  const store = useLiquidityV3ItemStore();

  useEffect(() => {
    if (isExist(id) && onlyDigits(id) !== id) {
      store.setError(new Error('Pool id is invalid'));

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    if (isExist(id) && tezos) {
      store.setId(new BigNumber(id));
      (async () => {
        try {
          await store.itemSore.load();
        } catch (_error) {
          store.setError(_error as Error);
        }
      })();
    }

    return () => store.itemSore.resetData();
  }, [store, id, tezos]);

  return {
    isLoading: store.itemIsLoading,
    isNotFound: store.error && isNotFoundError(store.error),
    error: store.error
  };
};
