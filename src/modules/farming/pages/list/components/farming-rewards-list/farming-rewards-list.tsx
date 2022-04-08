import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useFarmingListStore } from '@modules/farming/hooks';
import { RewardInfo } from '@shared/structures';
import { FarmingListPandingReward } from '@tests/farming';

import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';

export const FarmingRewardsList: FC = observer(() => {
  const farmingListStore = useFarmingListStore();
  const { handleHarvestAll, translation } = useFarmingRewardsListViewModel();
  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

  return (
    <RewardInfo
      amount={farmingListStore.claimablePendingRewards}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      rewardButtonAttributeTestId={FarmingListPandingReward.HARVEST_ALL_BUTTON}
      pendingRewardAttributeTestId={FarmingListPandingReward.PENDING_REWARD}
    />
  );
});
