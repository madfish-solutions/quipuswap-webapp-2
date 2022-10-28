import { useRootStore } from '@providers/root-store-provider';

import { LiquidityItemStore } from '../../store';

export const useLiquidityItemStore = () => {
  const { liquidityItemStore } = useRootStore();

  return liquidityItemStore as LiquidityItemStore;
};
