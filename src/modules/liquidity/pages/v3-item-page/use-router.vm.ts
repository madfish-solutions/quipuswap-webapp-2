import { useEffect } from 'react';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { isExist } from '@shared/helpers';

import { useContractAddress } from './hooks/use-contract-address';

export const useRouterViewModel = () => {
  const { tab, address } = useContractAddress();
  const liquidityV3ItemStore = useLiquidityV3ItemStore();
  const { itemSore, itemIsLoading, error, isNotFound } = liquidityV3ItemStore;

  useEffect(() => {
    if (isExist(address)) {
      liquidityV3ItemStore.setAddress(address);
      (async () => {
        try {
          await itemSore.load();
        } catch (_error) {
          liquidityV3ItemStore.setError(_error as Error);
        }
      })();
    }

    return () => itemSore.resetData();
  }, [liquidityV3ItemStore, address, itemSore]);

  // eslint-disable-next-line no-console
  console.log('params', { tab, address, isNotFound, error });

  return {
    isLoading: itemIsLoading,
    isNotFound,
    error
  };
};
