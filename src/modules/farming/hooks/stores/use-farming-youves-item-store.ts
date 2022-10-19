import { FarmingYouvesItemStore } from '@modules/farming/store';
import { useRootStore } from '@providers/root-store-provider';

export const useFarmingYouvesItemStore = () => {
  const { farmingYouvesItemStore } = useRootStore();

  return farmingYouvesItemStore as FarmingYouvesItemStore;
};
