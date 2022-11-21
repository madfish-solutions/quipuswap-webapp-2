import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { isExist } from '@shared/helpers';

export const useRouterViewModel = () => {
  const params = useParams();
  const address = params['*'];
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

  return {
    isLoading: itemIsLoading,
    isNotFound,
    error
  };
};
