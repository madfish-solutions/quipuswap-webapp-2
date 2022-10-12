import { useBucketContract } from '@modules/new-liquidity/hooks';
import { useLiquidityBackerRewards } from '@modules/new-liquidity/hooks/helpers/use-liquidity-backer-rewards';

export const useNewLiquidityRewards = () => {
  const { bucketContract } = useBucketContract();

  const { backerRewards } = useLiquidityBackerRewards({ bucketContract });

  return { rewards: backerRewards };
};
