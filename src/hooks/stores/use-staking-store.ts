import { useRootStore } from '@providers/RootStoreProvider';

export const useStakingStore = () => {
  const { stakingStore } = useRootStore();

  return stakingStore;
};
