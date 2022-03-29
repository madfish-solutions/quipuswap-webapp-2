import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { FarmingListPandingReward } from '@tests/farming/list';

import { RewardInfo } from '../reward-info';
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
      rewardButtonAttributeTestId={FarmingListPandingReward.HARVEST_ALL_BUTTON}
      pendingRewardAttributeTestId={FarmingListPandingReward.PENDING_REWARD}
    />
  );
});
