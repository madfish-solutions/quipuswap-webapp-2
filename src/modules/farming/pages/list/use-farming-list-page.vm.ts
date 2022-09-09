import { useEffect } from 'react';

import { useFarmingListStore, useHarvestAndRollStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import { farmingListDataHelper } from './farming-list-data.helper';

export const useFarmingListPageViewModel = () => {
  const isReady = useReady();
  const { accountPkh } = useAuthStore();
  const farmingListStore = useFarmingListStore();
  const { getFarmingList } = useGetFarmingList();
  const { getFarmingStats } = useGetFarmingStats();
  const { opened } = useHarvestAndRollStore();

  const { t } = useTranslation();
  const title = t('common|Farming');

  /*
    Load data
  */
  useEffect(() => {
    if (isReady) {
      void getFarmingList();
      void getFarmingStats();
    }
  }, [getFarmingList, getFarmingStats, isReady]);

  const { listStore, list } = farmingListStore;
  const { isLoading } = listStore;

  const data = list?.map(item => farmingListDataHelper(item, accountPkh));

  return {
    isLoading,
    list: data ?? [],
    title,
    opened
  };
};
