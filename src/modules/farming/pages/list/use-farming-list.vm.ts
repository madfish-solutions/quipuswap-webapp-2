import { useEffect } from 'react';

import { useFarmingListStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';

export const useFarmingListViewModel = () => {
  const farmingListStore = useFarmingListStore();
  const isReady = useReady();
  const { getFarmingList } = useGetFarmingList();
  const { getFarmingStats } = useGetFarmingStats();

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
    list
  };
};
