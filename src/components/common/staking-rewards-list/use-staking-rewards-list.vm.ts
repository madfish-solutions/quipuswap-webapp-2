import { useDoHarvestAll } from '@containers/staking/hooks/use-do-harvest-all';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

export const useStakingRewardsListViewModel = () => {
  const stakingListStore = useStakingListStore();
  const { doHarvestAll } = useDoHarvestAll();

  const handleHarvestAll = () => {
    doHarvestAll(stakingListStore.listStore.data);
  };

  return {
    handleHarvestAll
  };
};
