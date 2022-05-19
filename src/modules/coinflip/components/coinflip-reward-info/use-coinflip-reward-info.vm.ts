import { useCoinflipStore } from '@modules/coinflip/hooks';
import { isNull } from '@shared/helpers';

const DEFAULT_USER_INFO = {
  userReward: null,
  gamesCount: null,
  tokensWon: null
};

export const useCoinflipRewardInfoViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { gameUserInfo, userReward } = coinflipStore;

  if (isNull(gameUserInfo)) {
    return DEFAULT_USER_INFO;
  }

  const { gamesCount, tokensWon } = gameUserInfo;

  return { userReward, gamesCount, tokensWon };
};
