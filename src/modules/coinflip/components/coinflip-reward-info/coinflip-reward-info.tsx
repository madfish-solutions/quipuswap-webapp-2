import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { GameUserInfo } from '../game-user-info';
import { RewardInfo } from '../reward-info';
import { useCoinflipRewardInfoViewModel } from './use-coinflip-reward-info.vm';

export const CoinflipRewardInfo: FC = observer(() => {
  const { tokensExchangeRateDollarEquivalent, gamesCount, tokensWon, isGamesCount, hasTokensReward, translation } =
    useCoinflipRewardInfoViewModel();

  const { rewardTooltip, yourGamesTooltip } = translation;

  return (
    <RewardInfo
      userReward={tokensExchangeRateDollarEquivalent}
      gamesCount={gamesCount}
      rewardTooltip={rewardTooltip}
      yourGamesTooltip={yourGamesTooltip}
      currency="$"
      hasTokensReward={hasTokensReward}
      isError={isGamesCount}
      details={<GameUserInfo tokensWon={tokensWon} />}
    />
  );
});
