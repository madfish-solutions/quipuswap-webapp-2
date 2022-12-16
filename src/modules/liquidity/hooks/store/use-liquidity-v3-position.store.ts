import { useRootStore } from '@providers/root-store-provider';

import { LiquidityV3PositionStore } from '../../store';

export const useLiquidityV3PositionStore = () => {
  const { liquidityV3PositionStore } = useRootStore();

  return liquidityV3PositionStore as LiquidityV3PositionStore;
};
