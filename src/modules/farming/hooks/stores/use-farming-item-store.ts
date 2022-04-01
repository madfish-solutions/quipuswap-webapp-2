import { FarmingItemStore } from '@modules/farming/store';
import { useRootStore } from '@providers/root-store-provider';

export const useFarmingItemStore = () => {
  const { farmingItemStore } = useRootStore();

  return farmingItemStore as FarmingItemStore;
};
