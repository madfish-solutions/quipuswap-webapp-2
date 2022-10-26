import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { useGetNewLiquidityList, useGetNewLiquidityStats, useNewLiquidityListStore } from '../../hooks';
import { mapLiquidityListItem } from './map-liquidity-list-item';

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const { list, hotPools } = useNewLiquidityListStore();
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

  const preparedList = list.map(mapLiquidityListItem);
  const preparedHotPools = hotPools.map(mapLiquidityListItem);

  return {
    title,
    preparedList,
    preparedHotPools
  };
};
