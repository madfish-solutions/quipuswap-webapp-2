import { useRootStore } from '@providers/root-store-provider';

import { NewLiquidityItemStore } from '../../store';

export const useLiquidityItemStore = () => {
  const { newLiquidityItemStore } = useRootStore();

  return newLiquidityItemStore as NewLiquidityItemStore;
};
