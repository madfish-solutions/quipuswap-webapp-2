import { useRootStore } from '@providers/root-store-provider';

import { FarmingListStore } from '../../store';

export const useFarmingListCommonStore = () => {
  const { farmingListStore } = useRootStore();

  return farmingListStore as FarmingListStore;
};
