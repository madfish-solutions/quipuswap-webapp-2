import { LiquidityV3PositionsStore } from '@modules/liquidity/store';
import { useRootStore } from '@providers/root-store-provider';

export const useLiquidityV3PositionsStore = () => {
  const { liquidityV3PositionsStore } = useRootStore();

  return liquidityV3PositionsStore as LiquidityV3PositionsStore;
};
