import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useGetNewLiquidityList, useNewLiquidityListStore } from './hooks';

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const rootStore = useRootStore();
  const newLiquidityListStore = useNewLiquidityListStore();
  // eslint-disable-next-line no-console
  console.log('newLiquidityListStore: ', newLiquidityListStore);
  const { getNewLiquidityList } = useGetNewLiquidityList();
  const [isInitialized, setIsInitialized] = useState(false);

  const { t } = useTranslation();
  const title = t('common|Liquidity');

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.newLiquidityListStore)) {
          await rootStore.createNewLiquidityListStore();
        }
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [rootStore]);

  /*
    Load data
  */
  useEffect(() => {
    if (isReady) {
      void getNewLiquidityList();
    }
  }, [getNewLiquidityList, isReady]);

  // eslint-disable-next-line no-console
  newLiquidityListStore?.list?.forEach(item => console.log('item: ', item));

  return {
    isInitialized,
    isLoading: false,
    list: [],
    title
  };
};
