import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { RewardInfo } from '../reward-info';
import { FarmingListPendingReward } from './farming-list-pending-reward';
import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';

export const FarmingRewardsList: FC = observer(() => {
  const { pendingRewards, handleHarvestAll, translation } = useFarmingRewardsListViewModel();

  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

  return (
    <RewardInfo
      amount={pendingRewards}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      rewardButtonAttributeTestId={FarmingListPendingReward.HARVEST_ALL_BUTTON}
      pendingRewardAttributeTestId={FarmingListPendingReward.PENDING_REWARD}
    />
  );
});
