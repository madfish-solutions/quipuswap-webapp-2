import { FarmingListStatsStore } from '@modules/farming/store';
import { useRootStore } from '@providers/root-store-provider';

export const useFarmingListStatsStore = () => {
  const { farmingListStatsStore } = useRootStore();

  return farmingListStatsStore as FarmingListStatsStore;
};
