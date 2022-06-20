import { useRootStore } from '@providers/root-store-provider';

import { StableswapFarmFilterStore } from '../../store';

export const useStableswapFarmFilterStore = () => {
  const { stableswapFarmFilterStore } = useRootStore();

  return stableswapFarmFilterStore as StableswapFarmFilterStore;
};
