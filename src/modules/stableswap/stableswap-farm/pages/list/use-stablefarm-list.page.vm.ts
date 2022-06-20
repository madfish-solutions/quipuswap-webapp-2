import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { useGetStableFarmList, useStableswapFarmListStore } from '../../../hooks';

const DEFAULT_VALUE = new BigNumber('0');

export const useStableswapFarmListPageViewModel = () => {
  const isReady = useReady();
  const stableswapFarmListStore = useStableswapFarmListStore();
  const { getStableFarmList } = useGetStableFarmList();
  const { t } = useTranslation();
  const title = t('stableswap|stableFarmTitle');

  useEffect(() => {
    if (isReady) {
      void getStableFarmList();
    }
  }, [getStableFarmList, isReady]);

  const { listStore, filteredList } = stableswapFarmListStore;
  const { isLoading } = listStore;

  const data = filteredList?.map(item => {
    if (item.yourDeposit && item.yourEarned) {
      return {
        ...item,
        shouldShowStakerInfo: item.yourDeposit.gt(DEFAULT_VALUE) || item.yourEarned.gt(DEFAULT_VALUE)
      };
    }

    return { ...item, yourDeposit: DEFAULT_VALUE, yourEarned: DEFAULT_VALUE };
  });

  return { title, isLoading, data: data ?? [] };
};
