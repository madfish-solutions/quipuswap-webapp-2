import { useRootStore } from '@providers/root-store-provider';

export const useFarmingFilterStore = () => {
  const { farmingFilterStore } = useRootStore();

  return farmingFilterStore;
};
