import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { useGetStableDividendsList, useStableDividendsListStore } from '../../../hooks';

const DEFAULT_VALUE = new BigNumber('0');

export const useStableDividendsListPageViewModel = () => {
  const isReady = useReady();
  const stableDividendsListStore = useStableDividendsListStore();
  const { getStableDividendsList } = useGetStableDividendsList();
  const { t } = useTranslation();
  const title = t('stableswap|stableDividendsTitle');

  useEffect(() => {
    if (isReady) {
      void getStableDividendsList();
    }
  }, [getStableDividendsList, isReady]);

  const { listStore, filteredList } = stableDividendsListStore;
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
