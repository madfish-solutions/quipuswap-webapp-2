import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { useGetLiquidityList, useGetLiquidityStats, useLiquidityListStore } from '../../hooks';
import { mapLiquidityListItem } from './map-liquidity-list-item';

export const useLiquidityPageViewModel = () => {
  const isReady = useReady();
  const { filteredList, hotPools } = useLiquidityListStore();
  const { getNewLiquidityList } = useGetLiquidityList();
  const { getNewLiquidityStats } = useGetLiquidityStats();

  const { t } = useTranslation();
  const title = t('common|Liquidity');

  useEffect(() => {
    if (isReady) {
      void getNewLiquidityList();
      void getNewLiquidityStats();
    }
  }, [getNewLiquidityList, getNewLiquidityStats, isReady]);

  const preparedList = filteredList.map(mapLiquidityListItem);
  const preparedHotPools = hotPools.map(mapLiquidityListItem);

  return {
    title,
    preparedList,
    preparedHotPools
  };
};
