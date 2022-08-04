import { useRootStore } from '@providers/root-store-provider';

import { NewLiquidityStatsStore } from '../../store';

export const useNewLiquidityStatsStore = () => {
  const { newLiquidityStatsStore } = useRootStore();

  return newLiquidityStatsStore as NewLiquidityStatsStore;
};
