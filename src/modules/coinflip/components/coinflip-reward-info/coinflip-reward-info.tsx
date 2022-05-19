import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { GameUserInfo } from '../game-user-info';
import { RewardInfo } from '../reward-info';
import { useCoinflipRewardInfoViewModel } from './use-coinflip-reward-info.vm';

export const CoinflipRewardInfo: FC = observer(() => {
  const { userReward, gamesCount, tokensWon } = useCoinflipRewardInfoViewModel();

  return (
    <RewardInfo
      userReward={userReward}
      gamesCount={gamesCount}
      rewardTooltip="Reward Tooltip"
      yourGamesTooltip="Your Games Tooltip"
      currency="$"
      details={<GameUserInfo tokensWon={tokensWon} />}
    />
  );
});
