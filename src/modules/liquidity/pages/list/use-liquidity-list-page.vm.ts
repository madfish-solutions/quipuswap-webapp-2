import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { isEqual } from '@shared/helpers';
import { useTranslation } from '@translation';

//
import { useGetLiquidityList, useGetLiquidityStats, useLiquidityListStore } from '../../hooks';
import { mapLiquidityListItem } from './map-liquidity-list-item';

export const useLiquidityPageViewModel = () => {
  const isReady = useReady();
  const { filteredList, hotPools, list } = useLiquidityListStore();
  const { getLiquidityList } = useGetLiquidityList();
  const { getLiquidityStats } = useGetLiquidityStats();

  const { t } = useTranslation();
  const title = t('common|Liquidity');

  useEffect(() => {
    if (isReady) {
      void getLiquidityList();
      void getLiquidityStats();
    }
  }, [getLiquidityList, getLiquidityStats, isReady]);

  const test = list.map(mapLiquidityListItem);
  const preparedList = filteredList.map(mapLiquidityListItem);
  const preparedHotPools = hotPools.map(mapLiquidityListItem);

  // eslint-disable-next-line no-console
  console.log(test.filter(item => isEqual(item.type, 'UNISWAP')));

  return {
    title,
    preparedList,
    preparedHotPools
  };
};
