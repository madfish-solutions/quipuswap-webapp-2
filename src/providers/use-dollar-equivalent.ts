import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

import { useTokenExchangeRate } from './use-token-exchange-rate';

export const useDollarEquivalent = (token: Token, amount: Nullable<BigNumber>) => {
  const tokenExchangeRate = useTokenExchangeRate(token);

  return tokenExchangeRate && amount ? amount.multipliedBy(tokenExchangeRate) : 0;
};
