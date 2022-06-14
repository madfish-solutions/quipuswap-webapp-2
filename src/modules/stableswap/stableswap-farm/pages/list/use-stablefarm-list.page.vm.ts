import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { useGetStableFarmList, useStableFarmListStore } from '../../../hooks';

const DEFAULT_VALUE = new BigNumber('0');

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

  const data = list.map((item, index) => {
    if (info.length > index) {
      return {
        ...item,
        ...info[index],
        shouldShowStakerInfo: info[index].yourDeposit.gt(DEFAULT_VALUE) || info[index].yourEarned.gt(DEFAULT_VALUE)
      };
    }

    return { ...item, yourDeposit: DEFAULT_VALUE, yourEarned: DEFAULT_VALUE };
  });

  return { title, isLoading, data };
};
