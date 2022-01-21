import BigNumber from 'bignumber.js';
import constate from 'constate';

import { NETWORK, TEZOS_TOKEN } from '@app.config';
import { Standard } from '@graphql';
import { getTokenSlug, isNetworkMainnet } from '@utils/helpers';

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
    if (tokenSlug !== getTokenSlug(TEZOS_TOKEN) || isNetworkMainnet(NETWORK)) {
      acc[tokenSlug] = new BigNumber(exchangeRate);
    }

    return acc;
  }, {});
});
