import { useEffect } from 'react';

import { useGetStakingList } from '@containers/staking/hooks/use-get-staking-list';
import { useGetStakingStats } from '@containers/staking/hooks/use-get-staking-stats';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useReady } from '@utils/dapp';

export const useStakingListViewModel = () => {
  const stakingListStore = useStakingListStore();
  const isReady = useReady();
  const { getStakingList } = useGetStakingList();
  const { getStakingStats } = useGetStakingStats();

  /*
   Load data
  */
  useEffect(() => {
    if (isReady) {
      void getStakingList();
      void getStakingStats();
    }
  }, [getStakingList, getStakingStats, isReady]);

  const { listStore, list } = stakingListStore;
  const { isLoading } = listStore;

  return {
    isLoading,
    list
  };
};
