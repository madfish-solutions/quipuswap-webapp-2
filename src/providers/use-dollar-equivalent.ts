import { BigNumber } from 'bignumber.js';

import { useTokensBalancesStore } from '@shared/hooks';
import { Nullable, Token } from '@shared/types';

import { useTokenExchangeRate } from './use-token-exchange-rate';

export const useDollarEquivalent = (token: Token, amount: Nullable<BigNumber>) => {
  const tokensBalancesStore = useTokensBalancesStore();
  const tokenExchangeRate = useTokenExchangeRate(token);
  const dollarEquivalent = tokenExchangeRate && amount ? amount.multipliedBy(tokenExchangeRate) : null;

  tokensBalancesStore.setDollarEquivalent(token, tokenExchangeRate, dollarEquivalent);

  return dollarEquivalent;
};
