import { useRootStore } from '@providers/root-store-provider';

import { LiquidityV3PoolStore } from '../../store';

export const useLiquidityV3PoolStore = () => {
  const { liquidityV3PoolStore } = useRootStore();

  return liquidityV3PoolStore as LiquidityV3PoolStore;
};
