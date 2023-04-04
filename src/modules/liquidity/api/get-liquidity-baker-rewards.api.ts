import { CLAIM_BOT_AVAILABLE_REWARDS_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

const createClaimAvailableRewardsUrl = (userAddress: string, poolId: string) =>
  `${CLAIM_BOT_AVAILABLE_REWARDS_URL}/${userAddress}/${poolId}`;

export interface ClaimRewards {
  allRewards: string;
  frozenRewards: string;
  claimedRewards: string;
}

export const getLiquidityBakerRewardsApi = async (accountPkh: string, poolId: string) => {
  return await jsonFetch<ClaimRewards>(createClaimAvailableRewardsUrl(accountPkh, poolId));
};
