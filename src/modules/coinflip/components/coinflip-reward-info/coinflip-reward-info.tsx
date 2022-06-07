import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { GameUserInfo } from '../game-user-info';
import { RewardInfo } from '../reward-info';
import { useCoinflipRewardInfoViewModel } from './use-coinflip-reward-info.vm';

interface Props {
  isLoading: boolean;
}

export const CoinflipRewardInfo: FC<Props> = observer(({ isLoading }) => {
  const { tokensExchangeRateDollarEquivalent, gamesCount, tokensWon } = useCoinflipRewardInfoViewModel();

  return (
    <RewardInfo
      userReward={tokensExchangeRateDollarEquivalent}
      gamesCount={gamesCount}
      rewardTooltip="Reward Tooltip"
      yourGamesTooltip="Your Games Tooltip"
      currency="$"
      isLoading={isLoading}
      details={<GameUserInfo tokensWon={tokensWon} />}
    />
  );
});
