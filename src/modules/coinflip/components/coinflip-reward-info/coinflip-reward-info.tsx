import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { GameUserInfo } from '../game-user-info';
import { RewardInfo } from '../reward-info';
import { useCoinflipRewardInfoViewModel } from './use-coinflip-reward-info.vm';

export const CoinflipRewardInfo: FC = observer(() => {
  const { tokensExchangeRateDollarEquivalent, gamesCount, tokensWon, isGamesCount } = useCoinflipRewardInfoViewModel();

  return (
    <RewardInfo
      userReward={tokensExchangeRateDollarEquivalent}
      gamesCount={gamesCount}
      rewardTooltip="Reward Tooltip"
      yourGamesTooltip="Your Games Tooltip"
      currency="$"
      isError={isGamesCount}
      details={<GameUserInfo tokensWon={tokensWon} />}
    />
  );
});
