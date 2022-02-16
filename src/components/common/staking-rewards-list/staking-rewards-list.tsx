import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { RewardInfo, RewardItem } from '../reward-info';

interface Props {
  pendingRewardAmount: BigNumber;
  pendingRewardCurrency: string;
  rewardItemTitle: string;
  rewardItemAmount: BigNumber;
  rewardItemCurrency: string;
  onHarvestAll: () => void;
}

export const StakingRewardsList: FC<Props> = ({
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
