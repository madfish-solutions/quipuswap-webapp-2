import { useRootStore } from '@providers/root-store-provider';

import { LiquidityListFiltersStore } from '../../store';

export const useLiquidityListFiltersStore = () => {
  const { liquidityListFiltersStore } = useRootStore();

  return liquidityListFiltersStore as LiquidityListFiltersStore;
};
