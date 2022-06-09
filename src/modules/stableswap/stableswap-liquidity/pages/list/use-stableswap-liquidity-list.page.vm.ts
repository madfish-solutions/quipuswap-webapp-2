import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { useStableswapListStore, useGetStableswapList, useGetStableswapStats } from '../../../hooks';

export const useStableswapLiquidityPageViewModel = () => {
  const stableswapListStore = useStableswapListStore();
  const isReady = useReady();
  const { getStableswapList } = useGetStableswapList();
  const { getStableswapStats } = useGetStableswapStats();

  const { t } = useTranslation();
  const title = t('common|Stableswap Liquidity');

  /*
    Load data
  */
  useEffect(() => {
    if (isReady) {
      void getStableswapList();
      void getStableswapStats();
    }
  }, [getStableswapList, getStableswapStats, isReady]);

  const { listStore, list } = stableswapListStore;
  const { isLoading } = listStore;

  return {
    isLoading,
    list: list ?? [],
    title
  };
};
