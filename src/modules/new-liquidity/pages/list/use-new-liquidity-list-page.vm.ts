import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { isHotPool } from '../../helpers';
import { useGetNewLiquidityList, useNewLiquidityListStore, useGetNewLiquidityStats } from '../../hooks';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const newLiquidityListStore = useNewLiquidityListStore();
  const { getNewLiquidityList } = useGetNewLiquidityList();
  const { getNewLiquidityStats } = useGetNewLiquidityStats();

  const { t } = useTranslation();
  const title = t('common|Liquidity');

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
    list: dataList,
    hotPools
  };
};
