import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useFarmingListRewardsStore } from '@modules/farming/hooks';
import { RewardInfo } from '@shared/structures';

import { RewardTokensList } from '../reward-tokens-list';
import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';

export const FarmingRewardsList: FC = observer(() => {
  const { claimablePendingRewardsInUsd, totalPendingRewardsInUsd } = useFarmingListRewardsStore();
  const { handleHarvestAll, translation } = useFarmingRewardsListViewModel();
  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

  return (
    <RewardInfo
      claimablePendingRewards={claimablePendingRewardsInUsd}
      totalPendingRewards={totalPendingRewardsInUsd}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      buttonUp
      details={<RewardTokensList />}
    />
  );
});
