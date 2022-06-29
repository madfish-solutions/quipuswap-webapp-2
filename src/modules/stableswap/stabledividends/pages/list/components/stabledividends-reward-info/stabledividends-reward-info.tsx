import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { RewardInfo } from '@shared/structures';

import { useStableswapLiquidityRewardInfoViewModel } from './stabledividends-reward-info.vm';

export const StableswapLiquidityRewardInfo: FC = observer(() => {
  const { claimablePendingRewards, harvestAll, harvestAllText } = useStableswapLiquidityRewardInfoViewModel();

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
