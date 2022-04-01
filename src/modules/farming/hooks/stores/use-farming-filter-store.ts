import { FarmingFilterStore } from '@modules/farming/store';
import { useRootStore } from '@providers/root-store-provider';

export const useFarmingFilterStore = () => {
  const { farmingFilterStore } = useRootStore();

  return farmingFilterStore as FarmingFilterStore;
};
