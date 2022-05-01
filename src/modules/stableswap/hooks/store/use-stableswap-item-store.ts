import { StableswapItemStore } from '@modules/stableswap/store';
import { useRootStore } from '@providers/root-store-provider';

export const useStableswapItemStore = () => {
  const { stableswapItemStore } = useRootStore();

  return stableswapItemStore as StableswapItemStore;
};
