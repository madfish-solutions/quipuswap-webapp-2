import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useFarmingListStore } from '@modules/farming/hooks';
import { RewardInfo } from '@shared/structures';

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
    />
  );
});
