import { useBucketContract } from '@modules/new-liquidity/hooks';
import { useLiquidityBakerRewards } from '@modules/new-liquidity/hooks/helpers/use-liquidity-baker-rewards';

export const useNewLiquidityRewards = () => {
  const { bucketContract } = useBucketContract();

  const { bakerRewards } = useLiquidityBakerRewards({ bucketContract });

  return { rewards: bakerRewards };
};
