import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

import { RewardInfo } from '../reward-info';
import { useStakingRewardsListViewModel } from './use-staking-rewards-list.vm';

export const StakingRewardsList: FC = observer(() => {
  const stakingListStore = useStakingListStore();
  const { handleHarvestAll, translation } = useStakingRewardsListViewModel();

  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

  return (
    <RewardInfo
      amount={stakingListStore.pendingRewards}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
    />
  );
});
