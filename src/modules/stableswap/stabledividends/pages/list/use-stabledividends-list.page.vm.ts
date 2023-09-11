import { useEffect } from 'react';

import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import { stableDividendsListDataHelper } from './stabledividends-list-data.helper';
import { useGetStableDividendsList, useStableDividendsListStore } from '../../../hooks';

export const useStableDividendsListPageViewModel = () => {
  const isReady = useReady();
  const stableDividendsListStore = useStableDividendsListStore();
  const { getStableDividendsList } = useGetStableDividendsList();
  const { t } = useTranslation();
  const title = t('stableswap|stableDividendsTitle');
  const { accountPkh } = useAuthStore();

  useEffect(() => {
    if (isReady) {
      void getStableDividendsList();
    }
  }, [getStableDividendsList, isReady]);

  const { listStore, filteredList } = stableDividendsListStore;
  const { isLoading } = listStore;

  const data = filteredList?.map(item => stableDividendsListDataHelper(item, accountPkh));

  return { title, isLoading, data: data ?? [] };
};
