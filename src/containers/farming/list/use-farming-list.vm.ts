import { useEffect } from 'react';

import { useGetFarmingList } from '@containers/farming/hooks/use-get-farming-list';
import { useGetFarmingStats } from '@containers/farming/hooks/use-get-farming-stats';
import { useFarmingListStore } from '@hooks/stores/use-farming-list-store';
import { useReady } from '@utils/dapp';

export const useFarmsListViewModel = () => {
  const stakingListStore = useFarmingListStore();
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

  const { listStore, list } = stakingListStore;
  const { isLoading } = listStore;

  return {
    isLoading,
    list
  };
};
