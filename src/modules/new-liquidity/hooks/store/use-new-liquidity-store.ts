import { useRootStore } from '@providers/root-store-provider';

import { NewLiquidityStore } from '../../store';

export const useNewLiquidityStore = () => {
  const { newLiquidityStore } = useRootStore();

  return newLiquidityStore as NewLiquidityStore;
};
