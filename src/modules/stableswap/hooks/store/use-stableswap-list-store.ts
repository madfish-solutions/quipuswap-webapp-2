import { StableswapListStore } from '@modules/stableswap/store';
import { useRootStore } from '@providers/root-store-provider';

export const useStableswapListStore = () => {
  const { stableswapListStore } = useRootStore();

  return stableswapListStore as StableswapListStore;
};
