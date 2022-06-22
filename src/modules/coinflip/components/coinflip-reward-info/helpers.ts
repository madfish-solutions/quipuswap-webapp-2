import { BigNumber } from 'bignumber.js';

import { getTokenSlug, isExist } from '@shared/helpers';

import { TokenWon } from '../../types';

export const getDollarsWin = (tokensWon: Array<TokenWon>, exchangeRate: Record<string, BigNumber>) => {
  const firstValue: Nullable<BigNumber> = new BigNumber('0');

  return tokensWon.reduce((accum: Nullable<BigNumber>, curr: TokenWon) => {
    const tokenSlug = getTokenSlug(curr.token);
    const tokenExchangeRate = exchangeRate[tokenSlug];

    return isExist(accum) && isExist(tokenExchangeRate) ? accum.plus(tokenExchangeRate) : null;
  }, firstValue);
};
