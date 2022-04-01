import { FarmingListStore } from '@modules/farming/store';
import { useRootStore } from '@providers/root-store-provider';

export const useFarmingListStore = () => {
  const { farmingListStore } = useRootStore();

  return farmingListStore as FarmingListStore;
};
