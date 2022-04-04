import { useRootStore } from '@providers/root-store-provider';

export const useFarmingItemStore = () => {
  const { farmingItemStore } = useRootStore();

  return farmingItemStore;
};
