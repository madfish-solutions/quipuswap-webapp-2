import { useRootStore } from '@providers/root-store-provider';

import { FarmingListStore } from '../../store';

export const useFarmingListStore = () => {
  const { farmingListStore } = useRootStore();

  return farmingListStore as FarmingListStore;
};
