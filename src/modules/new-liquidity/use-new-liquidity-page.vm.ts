import { useEffect, useState } from 'react';

import { PERCENT } from '@config/constants';
import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

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

  const stats = [
    {
      title: t('newLiquidity|tvl'),
      tooltip: t('newLiquidity|tvlTooltip'),
      amount: newLiquidityListStore?.stats?.totalValueLocked ?? null,
      testId: 'statsTVL'
    },
    {
      title: t('newLiquidity|maxApr'),
      tooltip: t('newLiquidity|maxAprTooltip'),
      amount: newLiquidityListStore?.stats?.maxApr ?? null,
      currency: PERCENT,
      testId: 'statsMaxAPR'
    },
    {
      title: t('newLiquidity|pools'),
      tooltip: t('newLiquidity|poolsTooltip'),
      amount: newLiquidityListStore?.stats?.poolsCount ?? null,
      currency: null,
      testId: 'statsPools'
    }
  ];

  return {
    title,
    stats,
    isInitialized,
    list: dataList,
    isLoading: false
  };
};
