import { useRootStore } from '@providers/root-store-provider';

export const useStakingItemStore = () => {
  const { stakingItemStore } = useRootStore();

  return stakingItemStore;
};
