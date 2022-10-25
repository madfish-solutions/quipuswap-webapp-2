import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { isHotPool } from '../../helpers';
import { useGetNewLiquidityList, useGetNewLiquidityStats, useNewLiquidityListStore } from '../../hooks';
import { PreparedLiquidityItem } from '../../interfaces';
import { mapLiquidityListItem } from './map-liquidity-list-item';

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const { list } = useNewLiquidityListStore();
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

  const dataList = list.map(mapLiquidityListItem) ?? [];
  const hotPools = dataList.filter(({ id, type }) => isHotPool(id, type));

  const shownItems: PreparedLiquidityItem[] = list.map(mapLiquidityListItem);

  return {
    title,
    list: shownItems,
    hotPools
  };
};
