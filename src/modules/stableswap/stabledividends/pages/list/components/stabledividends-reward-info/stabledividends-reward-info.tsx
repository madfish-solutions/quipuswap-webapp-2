import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { RewardInfo } from '@shared/structures';

import { useStableDividendsRewardInfoViewModel } from './stabledividends-reward-info.vm';

export const StableDividendsRewardInfo: FC = observer(() => {
  const { claimablePendingRewards, harvestAll, harvestAllText } = useStableDividendsRewardInfoViewModel();

  return (
    <RewardInfo
      claimablePendingRewards={claimablePendingRewards}
      currency={DOLLAR}
      onButtonClick={harvestAll}
      buttonText={harvestAllText}
      buttonUp
    />
  );
});
