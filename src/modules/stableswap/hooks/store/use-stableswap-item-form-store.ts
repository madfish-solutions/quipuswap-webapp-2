import { useRootStore } from '@providers/root-store-provider';

import { StableswapItemFormStore } from '../../store';

export const useStableswapItemFormStore = () => {
  const { stableswapItemFormStore } = useRootStore();

  return stableswapItemFormStore as StableswapItemFormStore;
};
