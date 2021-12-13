import { getTokenSlug } from '@utils/helpers';
import BigNumber from 'bignumber.js';
import constate from 'constate';

import { useExchangeRates } from './useExchangeRate';

export const [NewExchangeRatesProvider, useNewExchangeRates] = constate(
  () => {
    // TODO: fetch exchange rates exactly here and remove useExchangeRate.ts
    const oldExchangeRates = useExchangeRates();

    return (oldExchangeRates ?? []).reduce<Record<string, BigNumber>>(
      (acc, { tokenAddress, tokenId, exchangeRate }) => {
        const tokenSlug = getTokenSlug({
          contractAddress: tokenAddress,
          fa2TokenId: tokenId,
          type: tokenId === undefined ? 'fa1.2' : 'fa2',
        });
        acc[tokenSlug] = new BigNumber(exchangeRate);
        return acc;
      },
      {},
    );
  },
);
