import { useEffect } from 'react';

import { useGetStakingList } from '@containers/staking/hooks/use-get-staking-list';
import { useGetStakingStats } from '@containers/staking/hooks/use-get-staking-stats';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useIsLoading } from '@utils/dapp';

export const useStakingListViewModel = () => {
  const stakingListStore = useStakingListStore();
  const isTezosLoading = useIsLoading();
  const { getStakingList } = useGetStakingList();
  const { getStakingStats } = useGetStakingStats();

  /*
   Load data
  */
  useEffect(() => {
    if (isTezosLoading) {
      return;
    }
    void getStakingList();
    void getStakingStats();
  }, [getStakingList, getStakingStats, isTezosLoading]);

  const { listStore } = stakingListStore;
  const { data: list, isLoading } = listStore;

  return {
    isLoading,
    list
  };
};
