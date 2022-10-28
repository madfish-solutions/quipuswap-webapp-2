import { useRootStore } from '@providers/root-store-provider';

import { NewLiquidityListStore } from '../../store';

export const useLiquidityListStore = () => {
  const { newLiquidityListStore } = useRootStore();

  return newLiquidityListStore as NewLiquidityListStore;
};
