import { useRootStore } from '@providers/RootStoreProvider';

export const useStakingFormStore = () => {
  const { stakingStore } = useRootStore();

  return stakingStore.form;
};
