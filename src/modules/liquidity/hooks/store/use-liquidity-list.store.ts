import { useRootStore } from '@providers/root-store-provider';

import { LiquidityListStore } from '../../store';

export const useLiquidityListStore = () => {
  const { liquidityListStore } = useRootStore();

  return liquidityListStore as LiquidityListStore;
};
