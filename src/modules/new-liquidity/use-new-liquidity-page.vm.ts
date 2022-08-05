import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useGetNewLiquidityList, useNewLiquidityListStore } from './hooks';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const rootStore = useRootStore();
  const newLiquidityListStore = useNewLiquidityListStore();
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

  const dataList = newLiquidityListStore?.list?.map(newLiquidityListDataHelper) ?? [];

  return {
    isInitialized,
    isLoading: false,
    list: dataList,
    title
  };
};
