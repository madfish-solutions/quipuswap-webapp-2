import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { RewardInfo } from '../reward-info';

interface Props {
  pendingRewardAmount: BigNumber;
  pendingRewardCurrency: string;
  rewardItemTitle: string;
  rewardItemAmount: BigNumber;
  rewardItemCurrency: string;
  onHarvestAll: () => void;
}

export const StakingRewardsList: FC<Props> = ({ pendingRewardAmount, pendingRewardCurrency, onHarvestAll }) => {
  return (
    <RewardInfo
      amount={pendingRewardAmount}
      onButtonClick={onHarvestAll}
      buttonText="Harvest All"
      currency={pendingRewardCurrency}
    />
  );
};
