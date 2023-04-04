import { useLiquidityBakerRewards } from '@modules/liquidity/hooks/helpers/use-liquidity-baker-rewards';

//AVAILABLE REWARDS
export const useNewLiquidityRewards = () => {
  const { bakerRewards } = useLiquidityBakerRewards();

  return { rewards: bakerRewards };
};
