import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useFarmingListRewardsStore } from '@modules/farming/hooks';

import { RewardInfo } from '../reward-info';
import { RewardTokensList } from '../reward-tokens-list';
import { useFarmingRewardsListViewModel } from './use-farming-rewards-list.vm';

export const FarmingRewardsList: FC = observer(() => {
  const { claimablePendingRewardsInUsd, totalPendingRewardsInUsd } = useFarmingListRewardsStore();
  const { handleHarvestAll, translation, userTotalDepositInfo } = useFarmingRewardsListViewModel();
  const { rewardsTooltipTranslation, harvestAllTranslation } = translation;

  return (
    <RewardInfo
      claimablePendingRewards={claimablePendingRewardsInUsd}
      totalPendingRewards={totalPendingRewardsInUsd}
      userTotalDepositInfo={userTotalDepositInfo}
      onButtonClick={handleHarvestAll}
      rewardTooltip={rewardsTooltipTranslation}
      buttonText={harvestAllTranslation}
      currency="$"
      buttonUp
      details={<RewardTokensList />}
    />
  );
});
