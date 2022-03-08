import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { RewardInfo } from '../reward-info';
import { useStakingRewardsListViewModel } from './use-staking-rewards-list.vm';

const mock = {
  pendingRewardAmount: new BigNumber('100.123'),
  pendingRewardCurrency: '$'
};

export const StakingRewardsList: FC = () => {
  const { handleHarvestAll } = useStakingRewardsListViewModel();

  return (
    <RewardInfo
      amount={mock.pendingRewardAmount}
      onButtonClick={handleHarvestAll}
      buttonText="Harvest All"
      currency={mock.pendingRewardCurrency}
    />
  );
};
