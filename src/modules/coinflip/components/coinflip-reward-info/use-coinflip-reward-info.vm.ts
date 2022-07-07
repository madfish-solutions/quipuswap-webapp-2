import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { isExist, isNotEmptyArray, isNull } from '@shared/helpers';

import { getDollarsWin } from './helpers';

const DEFAULT_USER_INFO = {
  tokensExchangeRateDollarEquivalent: null,
  gamesCount: null,
  tokensWon: null,
  hasTokensReward: false,
  isGamesCount: undefined
};

export const useCoinflipRewardInfoViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { gamesCount, tokensWon, tokensWithReward } = coinflipStore;
  const exchangeRate = useNewExchangeRates();
  const isGamesCount = isExist(gamesCount);

  if (isNull(gamesCount) || isNull(tokensWon)) {
    return DEFAULT_USER_INFO;
  }
  const tokensExchangeRateDollarEquivalent = getDollarsWin(tokensWon, exchangeRate);

  return {
    tokensExchangeRateDollarEquivalent,
    gamesCount,
    tokensWon,
    isGamesCount,
    hasTokensReward: isNotEmptyArray(tokensWithReward)
  };
};
