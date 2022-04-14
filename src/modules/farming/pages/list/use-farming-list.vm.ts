import { useEffect } from 'react';

import { useFarmingListStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

export const useFarmingListViewModel = () => {
  const farmingListStore = useFarmingListStore();
  const isReady = useReady();
  const { getFarmingList } = useGetFarmingList();
  const { getFarmingStats } = useGetFarmingStats();

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

  return {
    isLoading,
    list,
    title
  };
};
