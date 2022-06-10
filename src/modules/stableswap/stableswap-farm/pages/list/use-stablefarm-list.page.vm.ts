import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { useGetStableFarmList, useStableFarmListStore } from '../../../hooks';

const DEFAULT_VALUE = 0;

export const useStableswapFarmListPageViewModel = () => {
  const isReady = useReady();
  const stableFarmListStore = useStableFarmListStore();
  const { getStableFarmList } = useGetStableFarmList();
  const { t } = useTranslation();
  const title = t('stableswap|stableFarmTitle');

  useEffect(() => {
    if (isReady) {
      void getStableFarmList();
    }
  }, [getStableFarmList, isReady]);

  const { listStore, list, info } = stableFarmListStore;
  const { isLoading } = listStore;

  const data = list.map(item => ({
    ...item,
    ...info[item.contractAddress],
    shouldShowStakerInfo:
      info[item.contractAddress]?.yourDeposit?.gt(DEFAULT_VALUE) ||
      info[item.contractAddress]?.yourEarned?.gt(DEFAULT_VALUE)
  }));

  return { title, isLoading, data };
};
