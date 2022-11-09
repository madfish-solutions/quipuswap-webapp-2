import { BigNumber } from 'bignumber.js';

import { getTokenSlug, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { TokenWon } from '../../types';

export const getDollarsWin = (tokensWon: Array<TokenWon>, exchangeRate: Record<string, BigNumber>) => {
  const firstValue: Nullable<BigNumber> = new BigNumber('0');

  return tokensWon.reduce((accum: BigNumber, curr: TokenWon) => {
    const tokenSlug = getTokenSlug(curr.token);
    const tokenExchangeRate = exchangeRate[tokenSlug];

    if (isExist(curr.amount) && isExist(tokenExchangeRate)) {
      return accum.plus(curr.amount?.multipliedBy(tokenExchangeRate));
    }

    return accum;
  }, firstValue);
};
