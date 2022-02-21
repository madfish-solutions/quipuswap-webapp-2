import { useRootStore } from '@providers/RootStoreProvider';

export const useStakingItemStore = () => {
  const { stakingItemStore } = useRootStore();

  return stakingItemStore;
};
