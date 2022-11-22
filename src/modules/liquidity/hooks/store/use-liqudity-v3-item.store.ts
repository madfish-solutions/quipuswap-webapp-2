import { useRootStore } from '@providers/root-store-provider';

import { LiquidityV3ItemStore } from '../../store';

export const useLiquidityV3ItemStore = () => {
  const { liquidityV3ItemStore } = useRootStore();

  return liquidityV3ItemStore as LiquidityV3ItemStore;
};
