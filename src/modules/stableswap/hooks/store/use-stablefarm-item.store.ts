import { useRootStore } from '@providers/root-store-provider';

import { StableFarmItemStore } from '../../store';

export const useStableFarmItemStore = () => {
  const { stableFarmItemStore } = useRootStore();

  return stableFarmItemStore as StableFarmItemStore;
};
