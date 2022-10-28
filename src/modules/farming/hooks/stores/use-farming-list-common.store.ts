import { useRootStore } from '@providers/root-store-provider';

import { FarmingListCommonStore } from '../../store';

export const useFarmingListCommonStore = () => {
  const { farmingListCommonStore } = useRootStore();

  return farmingListCommonStore as FarmingListCommonStore;
};
