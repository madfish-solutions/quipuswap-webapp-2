import { useRootStore } from '@providers/root-store-provider';

export const useStakingListStore = () => {
  const { stakingListStore } = useRootStore();

  return stakingListStore;
};
