import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import { isHotPool } from './helpers';
import { useGetNewLiquidityList, useNewLiquidityListStore } from './hooks';
import { useGetNewLiquidityStats } from './hooks/use-get-new-liquidity-stats';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const rootStore = useRootStore();
  const newLiquidityListStore = useNewLiquidityListStore();
  const { getNewLiquidityList } = useGetNewLiquidityList();
  const { getNewLiquidityStats } = useGetNewLiquidityStats();
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
      void getNewLiquidityStats();
    }
  }, [getNewLiquidityList, getNewLiquidityStats, isReady]);

  const dataList = newLiquidityListStore?.list?.map(newLiquidityListDataHelper) ?? [];
  const hotPools = dataList.filter(({ id, type }) => isHotPool(id, type));

  return {
    title,
    isInitialized,
    list: dataList,
    hotPools
  };
};