import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { isNull } from '@shared/helpers';

import { getDollarsWin } from './helpers';

const DEFAULT_USER_INFO = {
  tokensExchangeRateDollarEquivalent: null,
  gamesCount: null,
  tokensWon: null
};

export const useCoinflipRewardInfoViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const exchangeRate = useNewExchangeRates();
  const { gamesCount, tokensWon } = coinflipStore;

  if (isNull(gamesCount) || isNull(tokensWon)) {
    return DEFAULT_USER_INFO;
  }
  const tokensExchangeRateDollarEquivalent = getDollarsWin(tokensWon, exchangeRate);

  return {
    tokensExchangeRateDollarEquivalent,
    gamesCount,
    tokensWon
  };
};
