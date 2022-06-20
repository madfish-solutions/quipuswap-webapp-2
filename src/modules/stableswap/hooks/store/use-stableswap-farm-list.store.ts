import { useRootStore } from '@providers/root-store-provider';

import { StableswapFarmListStore } from '../../store';

export const useStableswapFarmListStore = () => {
  const { stableswapFarmListStore } = useRootStore();

  return stableswapFarmListStore as StableswapFarmListStore;
};
