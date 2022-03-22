import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { StakeListPandingReward } from '@tests/staking/list';

import { RewardInfo } from '../reward-info';
import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';

export const StakingRewardsList: FC = observer(() => {
  const stakingListStore = useStakingListStore();
  const { handleHarvestAll, translation } = useFarmingRewardsListViewModel();

  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

  return (
    <RewardInfo
      amount={stakingListStore.pendingRewards}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      rewardButtonAttributeTestId={StakeListPandingReward.HARVEST_ALL_BUTTON}
      pendingRewardAttributeTestId={StakeListPandingReward.PENDING_REWARD}
    />
  );
});
