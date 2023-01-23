import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';

export const useTickSpacing = () => {
  const poolStore = useLiquidityV3PoolStore();

  return poolStore.item?.storage.constants.tick_spacing.toNumber();
};
