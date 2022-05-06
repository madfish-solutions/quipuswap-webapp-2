import { useRootStore } from '@providers/root-store-provider';

import { StableswapFilterStore } from '../../store';

export const useStableswapFilterStore = () => {
  const { stableswapFilterStore } = useRootStore();

  return stableswapFilterStore as StableswapFilterStore;
};
