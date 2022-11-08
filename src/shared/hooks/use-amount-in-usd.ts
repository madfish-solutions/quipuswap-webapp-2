import BigNumber from 'bignumber.js';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE } from '@config/constants';
import { useNewExchangeRates } from '@providers/use-exchange-rate';
import { getDollarEquivalent, getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

export const useAmountInUsd = () => {
  const exchangeRates = useNewExchangeRates();

  const getAmountInUsd = (amount: BigNumber, token: Token) => {
    const tokenSlug = getTokenSlug(token);
    const tokenExchangeRate = exchangeRates[tokenSlug];
    const correctExchangeRate = IS_NETWORK_MAINNET ? tokenExchangeRate : TESTNET_EXCHANGE_RATE;

    return getDollarEquivalent(amount, correctExchangeRate);
  };

  return { getAmountInUsd };
};
