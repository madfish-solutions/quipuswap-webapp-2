import { useRootStore } from '@providers/RootStoreProvider';

export const useStakingListStore = () => {
  const { stakingListStore } = useRootStore();

  return stakingListStore;
};
