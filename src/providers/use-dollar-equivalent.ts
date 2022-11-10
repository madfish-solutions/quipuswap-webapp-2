import { BigNumber } from 'bignumber.js';

import { TokensBalancesLSApi } from '@shared/api';
import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { useTokenExchangeRate } from './use-token-exchange-rate';

const DEFAULT_WEIGHT_WITHOUT_EXCHANGE_RATE = 0.0001;

export const useDollarEquivalent = (token: Token, amount: Nullable<BigNumber>) => {
  const tokenExchangeRate = useTokenExchangeRate(token);

  const dollarEquivalent = tokenExchangeRate && amount ? amount.multipliedBy(tokenExchangeRate) : 0;

  if (amount && amount.gt('0')) {
    TokensBalancesLSApi.setTokenBalance(
      getTokenSlug(token),
      tokenExchangeRate ? Number(dollarEquivalent.toFixed()) : DEFAULT_WEIGHT_WITHOUT_EXCHANGE_RATE
    );
  }

  return dollarEquivalent;
};
