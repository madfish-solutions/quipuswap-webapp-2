import { useRootStore } from '@providers/root-store-provider';

import { StableFarmFilterStore } from '../../store';

export const useStableFarmFilterStore = () => {
  const { stableFarmFilterStore } = useRootStore();

  return stableFarmFilterStore as StableFarmFilterStore;
};
