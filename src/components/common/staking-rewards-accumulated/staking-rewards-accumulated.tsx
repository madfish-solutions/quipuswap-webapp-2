import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { RewardInfo } from '../reward-info';
import { RewardItem } from '../reward-info/reward-item';

interface Props {
  pendingRewardAmount: BigNumber;
  pendingRewardCurrency: string;
  rewardItemTitle: string;
  rewardItemAmount: BigNumber;
  rewardItemCurrency: string;
  onHarvestAll: () => void;
}

export const StakingRewardsAccumulated: FC<Props> = ({
  pendingRewardAmount,
  pendingRewardCurrency,
  rewardItemTitle,
  rewardItemAmount,
  rewardItemCurrency,
  onHarvestAll
}) => {
  return (
    <RewardInfo amount={pendingRewardAmount} onHarvestAll={onHarvestAll} currency={pendingRewardCurrency}>
      <RewardItem title={rewardItemTitle} amount={rewardItemAmount} currency={rewardItemCurrency} />
    </RewardInfo>
  );
};
