import { useRootStore } from '@providers/root-store-provider';

import { SwapStore } from '../store';

export const useSwapStore = () => {
  const { swapStore } = useRootStore();

  return swapStore as SwapStore;
};
