import { useRootStore } from '@providers/root-store-provider';

export const useStakingFilterStore = () => {
  const { stakingFilterStore } = useRootStore();

  return stakingFilterStore;
};
