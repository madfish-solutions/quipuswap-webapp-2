import { TaquitoContract } from '@shared/dapp';

export const getNewLiquidityBakerRewardsApi = async (bucketContract: TaquitoContract, accountPkh: string) => {
  return await bucketContract.contractViews.get_user_reward(accountPkh).executeView({ viewCaller: accountPkh });
};
