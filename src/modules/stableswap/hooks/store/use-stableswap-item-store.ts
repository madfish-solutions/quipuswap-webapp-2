import { useRootStore } from '@providers/root-store-provider';

import { StableswapItemStore } from '../../store';

export const useStableswapItemStore = () => {
  const { stableswapItemStore } = useRootStore();

  return stableswapItemStore as StableswapItemStore;
};
