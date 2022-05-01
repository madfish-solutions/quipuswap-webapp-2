import { StableswapFilterStore } from '@modules/stableswap/store';
import { useRootStore } from '@providers/root-store-provider';

export const useStableswapFilterStore = () => {
  const { stableswapFilterStore } = useRootStore();

  return stableswapFilterStore as StableswapFilterStore;
};
