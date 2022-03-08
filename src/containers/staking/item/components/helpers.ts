import BigNumber from 'bignumber.js';

import { ZERO_ADDRESS } from '@app.config';
import { StakingItem, StakingStatus, UserStakingStats } from '@interfaces/staking.interfaces';
import { toIntegerSeconds } from '@utils/helpers';
import { Optional, WhitelistedBaker } from '@utils/types';

const rewardPrecision = new BigNumber('1e18');

export const makeBaker = (delegateAddress: Optional<string>, knownBakers: WhitelistedBaker[]) => {
  if (typeof delegateAddress === 'string' && delegateAddress !== ZERO_ADDRESS) {
    return knownBakers.find(({ address }) => address === delegateAddress) ?? { address: delegateAddress };
  }

  return null;
};

export const getEarnBalance = (stakeItem: StakingItem, stakingStats: UserStakingStats) => {
  if (stakeItem.stakeStatus === StakingStatus.PENDING || stakingStats.staked.eq(0)) {
    return new BigNumber(0);
  }

  const { tvlInStakedToken } = stakeItem;
  const now = toIntegerSeconds(Date.now());
  const endTimestamp = toIntegerSeconds(new Date(stakeItem.endTime));
  const lastUpdateTimestamp = toIntegerSeconds(new Date(stakeItem.udp));
  const timeDiff = Math.min(now, endTimestamp) - lastUpdateTimestamp;
  const reward = stakeItem.rewardPerSecond.times(timeDiff);
  const rewardPerShare = stakeItem.rewardPerShare.plus(reward.dividedToIntegerBy(tvlInStakedToken));

  const earnedWithoutPrecision = stakingStats.earned.dividedToIntegerBy(rewardPrecision);

  return stakingStats.earned
    .plus(stakingStats.staked.times(rewardPerShare))
    .minus(stakingStats.prevEarned)
    .minus(earnedWithoutPrecision.times(rewardPrecision));
};
