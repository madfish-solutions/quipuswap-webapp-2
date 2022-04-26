import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useFarmingListStore } from '@modules/farming/hooks';
import { RewardInfo } from '@shared/structures';
import { FarmingListPandingReward } from '@tests/farming';

import { RewardTokensList } from '../reward-tokens-list';
import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';

export const FarmingRewardsList: FC = observer(() => {
  const farmingListStore = useFarmingListStore();
  const { claimablePendingRewards, totalPendingRewards } = farmingListStore;
  const { handleHarvestAll, translation } = useFarmingRewardsListViewModel();
  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

  return (
    <RewardInfo
      claimablePendingRewards={claimablePendingRewards}
      totalPendingRewards={totalPendingRewards}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      buttonUp
      details={<RewardTokensList />}
      rewardButtonAttributeTestId={FarmingListPandingReward.HARVEST_ALL_BUTTON}
      pendingRewardAttributeTestId={FarmingListPandingReward.PENDING_REWARD}
    />
  );
});
