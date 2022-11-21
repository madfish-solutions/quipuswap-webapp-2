import { useEffect } from 'react';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isExist, isNotFoundError } from '@shared/helpers';

import { useContractAddress } from './hooks/use-contract-address';

export const useRouterViewModel = () => {
  const { tezos } = useRootStore();
  const { address } = useContractAddress();
  const store = useLiquidityV3ItemStore();

  useEffect(() => {
    if (isExist(address) && tezos) {
      store.setAddress(address);
      (async () => {
        try {
          await store.itemSore.load();
        } catch (_error) {
          store.setError(_error as Error);
        }
      })();
    }

    return () => store.itemSore.resetData();
  }, [store, address, tezos]);

  return {
    isLoading: store.itemIsLoading,
    isNotFound: store.error && isNotFoundError(store.error),
    error: store.error
  };
};
