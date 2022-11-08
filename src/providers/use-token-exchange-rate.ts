import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { useNewExchangeRates } from './use-exchange-rate';

export const useTokenExchangeRate = (token: Token) => {
  const exchangeRates = useNewExchangeRates();

  return exchangeRates[getTokenSlug(token)] ?? null;
};
