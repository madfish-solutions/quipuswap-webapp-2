import { HarvestAndRollStore } from '@modules/farming/store';
import { useRootStore } from '@providers/root-store-provider';

export const useHarvestAndRollStore = () => {
  const { harvestAndRollStore } = useRootStore();

  return harvestAndRollStore as HarvestAndRollStore;
};
