import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { useNewExchangeRates } from '@providers/use-exchange-rate';
import { Token } from '@shared/types';

import { getTokenSlug, isExist } from '../helpers';

export const useTokenAmountInUsd = (token: Token) => {
  const exchangeRate = useNewExchangeRates();
  const tokenSlug = getTokenSlug(token);
  const tokenExchangeRate = exchangeRate[tokenSlug];

  return useMemo(
    () => ({
      getUsd: (amount: Nullable<BigNumber>) =>
        isExist(amount) && isExist(tokenExchangeRate) ? amount.multipliedBy(tokenExchangeRate) : null
    }),
    [tokenExchangeRate]
  );
};
