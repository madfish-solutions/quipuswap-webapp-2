import { useRootStore } from '@providers/root-store-provider';

import { StableswapListStore } from '../../store';

export const useStableswapListStore = () => {
  const { stableswapListStore } = useRootStore();

  return stableswapListStore as StableswapListStore;
};
