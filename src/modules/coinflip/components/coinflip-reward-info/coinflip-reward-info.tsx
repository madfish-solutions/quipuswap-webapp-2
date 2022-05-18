import { FC } from 'react';

import { RewardTokensList } from '@modules/farming/pages/list/components/reward-tokens-list';

import { RewardInfo } from '../reward-info';

export const CoinflipRewardInfo: FC = () => {
  return (
    <RewardInfo
      userReward={1000}
      gamesCount={100}
      rewardTooltip="Reward Tooltip"
      yourGamesTooltip="Your Games Tooltip"
      currency="$"
      details={<RewardTokensList />}
    />
  );
};
