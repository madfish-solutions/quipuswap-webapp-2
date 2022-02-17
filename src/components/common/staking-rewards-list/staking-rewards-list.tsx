import { FC } from 'react';

import BigNumber from 'bignumber.js';
import { noop } from 'rxjs';

import { RewardInfo } from '../reward-info';

const mock = {
  pendingRewardAmount: new BigNumber('100.123'),
  pendingRewardCurrency: '$'
};

export const StakingRewardsList: FC = () => {
  const onHarvestAll = noop;

  return (
    <RewardInfo
      amount={mock.pendingRewardAmount}
      onButtonClick={onHarvestAll}
      buttonText="Harvest All"
      currency={mock.pendingRewardCurrency}
    />
  );
};
