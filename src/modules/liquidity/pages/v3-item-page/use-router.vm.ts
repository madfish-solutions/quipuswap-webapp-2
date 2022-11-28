import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, isNotFoundError } from '@shared/helpers';

import { useRouteParams } from './hooks/use-route-params';

export const useRouterViewModel = () => {
  const { tezos } = useRootStore();
  const { id } = useRouteParams();
  const store = useLiquidityV3ItemStore();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('useEffect', id);
    if (isExist(id) && tezos) {
      store.setId(new BigNumber(id));
      // eslint-disable-next-line no-console
      console.log('loading', id);
      (async () => {
        try {
          await store.itemSore.load();
        } catch (_error) {
          // eslint-disable-next-line no-console
          console.error(_error, id);
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
