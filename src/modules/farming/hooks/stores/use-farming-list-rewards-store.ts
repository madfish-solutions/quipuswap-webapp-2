import { useRootStore } from '@providers/root-store-provider';

import { FarmingListRewardsStore } from '../../store';

export const useFarmingListRewardsStore = () => {
  const { farmingListRewardsStore } = useRootStore();

  return farmingListRewardsStore as FarmingListRewardsStore;
};
