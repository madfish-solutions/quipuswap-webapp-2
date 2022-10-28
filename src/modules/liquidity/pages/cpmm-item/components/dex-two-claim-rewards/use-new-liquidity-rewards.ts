import { useBucketContract } from '@modules/liquidity/hooks';
import { useLiquidityBakerRewards } from '@modules/liquidity/hooks/helpers/use-liquidity-baker-rewards';

export const useNewLiquidityRewards = () => {
  const { bucketContract } = useBucketContract();

  const { bakerRewards } = useLiquidityBakerRewards({ bucketContract });

  return { rewards: bakerRewards };
};
