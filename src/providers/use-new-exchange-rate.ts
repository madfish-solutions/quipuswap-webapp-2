import { BigNumber } from 'bignumber.js';
import constate from 'constate';

import { EXCHANGE_RATES_URL, IS_NETWORK_MAINNET } from '@config/config';
import { TEZOS_TOKEN } from '@config/tokens';
import { getTokenSlug } from '@shared/helpers';
import { useUpdateOnBlockSWR } from '@shared/hooks';

import { useTezos } from './use-dapp';

interface RawExchangeRateEntry {
  tokenAddress?: string;
  tokenId?: number;
  exchangeRate: string;
}

interface ExchangeRateEntry extends RawExchangeRateEntry {
  tokenAddress: string;
}

export const [ExchangeRatesProvider, useExchangeRates] = constate(() => {
  const tezos = useTezos();

  const getExchangeRates = async () =>
    fetch(EXCHANGE_RATES_URL)
      .then(async res => res.json())
      .then((rawExchangeRates: RawExchangeRateEntry[]) =>
        rawExchangeRates.map(({ tokenAddress, ...restProps }) => ({
          ...restProps,
          tokenAddress: tokenAddress ?? 'tez'
        }))
      )
      // eslint-disable-next-line no-console
      .catch(console.error);

  const { data: exchangeRates } = useUpdateOnBlockSWR(tezos, ['exchange-rates'], getExchangeRates, {
    refreshInterval: 30000
  });

  return exchangeRates as ExchangeRateEntry[] | undefined;
});

export const [NewExchangeRatesProvider, useNewExchangeRates] = constate(() => {
  // TODO: fetch exchange rates exactly here and remove useExchangeRate.ts
  const oldExchangeRates = useExchangeRates();

  return (oldExchangeRates ?? []).reduce<Record<string, BigNumber>>((acc, { tokenAddress, tokenId, exchangeRate }) => {
    const tokenSlug = getTokenSlug({
      contractAddress: tokenAddress,
      fa2TokenId: tokenId
    });
    if (tokenSlug !== getTokenSlug(TEZOS_TOKEN) || IS_NETWORK_MAINNET) {
      acc[tokenSlug] = new BigNumber(exchangeRate);
    }

    return acc;
  }, {});
});
