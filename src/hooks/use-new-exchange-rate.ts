import BigNumber from 'bignumber.js';
import constate from 'constate';

import { IS_NETWORK_MAINNET, TEZOS_TOKEN } from '@app.config';
import { Standard } from '@graphql';
import { getTokenSlug } from '@utils/helpers';

import { useExchangeRates } from './useExchangeRate';

export const [NewExchangeRatesProvider, useNewExchangeRates] = constate(() => {
  // TODO: fetch exchange rates exactly here and remove useExchangeRate.ts
  const oldExchangeRates = useExchangeRates();

  return (oldExchangeRates ?? []).reduce<Record<string, BigNumber>>((acc, { tokenAddress, tokenId, exchangeRate }) => {
    const tokenSlug = getTokenSlug({
      contractAddress: tokenAddress,
      fa2TokenId: tokenId,
      type: tokenId === undefined ? Standard.Fa12 : Standard.Fa2
    });
    if (tokenSlug !== getTokenSlug(TEZOS_TOKEN) || IS_NETWORK_MAINNET) {
      acc[tokenSlug] = new BigNumber(exchangeRate);
    }

    return acc;
  }, {});
});
