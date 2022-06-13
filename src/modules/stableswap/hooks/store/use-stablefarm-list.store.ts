import { useRootStore } from '@providers/root-store-provider';

import { StableFarmListStore } from '../../store';

export const useStableFarmListStore = () => {
  const { stableFarmListStore } = useRootStore();

  return stableFarmListStore as StableFarmListStore;
};
