import { FC } from 'react';

import { noop } from 'rxjs';

import { RewardInfo } from '../reward-info';
import { RewardItem } from '../reward-info/reward-item';

export const StakingRewards: FC = () => {
  return (
    <RewardInfo pendingRewardAmount="10000.123" handleHarvestAll={noop}>
      <RewardItem title="Your Claimed" amount="1000.123" currency="$" />
    </RewardInfo>
  );
};
