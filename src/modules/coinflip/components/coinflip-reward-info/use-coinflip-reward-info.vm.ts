/* eslint-disable no-console */
import { BigNumber } from 'bignumber.js';

import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, isNull } from '@shared/helpers';

const DEFAULT_USER_INFO = {
  tokensExchangeRateDollarEquivalent: '-',
  gamesCount: null,
  tokensWon: null
};

export const useCoinflipRewardInfoViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const exchangeRate = useNewExchangeRates();
  const { gameUserInfo } = coinflipStore;
  const { gamesCount, tokensWon } = gameUserInfo;

  if (isNull(gameUserInfo) || isNull(tokensWon)) {
    return DEFAULT_USER_INFO;
  }
  const tokensExchangeRateDollarEquivalent = tokensWon.reduce((accum, curr) => {
    const tokenSlug = getTokenSlug(curr.token);
    const tokenExchangeRate = exchangeRate[tokenSlug];

    return accum.plus(tokenExchangeRate);
  }, new BigNumber(0));

  return {
    tokensExchangeRateDollarEquivalent,
    gamesCount,
    tokensWon
  };
};
