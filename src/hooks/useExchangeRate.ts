import constate from 'constate';

import { EXCHANGE_RATES_URL } from '@app.config';

import { useToasts } from './use-toasts';
import useUpdateOnBlockSWR from './useUpdateOnBlockSWR';

interface RawExchangeRateEntry {
  tokenAddress?: string;
  tokenId?: number;
  exchangeRate: string;
}

interface ExchangeRateEntry extends RawExchangeRateEntry {
  tokenAddress: string;
}

export const [ExchangeRatesProvider, useExchangeRates] = constate(() => {
  const { showErrorToast } = useToasts();

  const getExchangeRates = async () =>
    fetch(EXCHANGE_RATES_URL)
      .then(async res => res.json())
      .then((rawExchangeRates: RawExchangeRateEntry[]) =>
        rawExchangeRates.map(({ tokenAddress, ...restProps }) => ({
          ...restProps,
          tokenAddress: tokenAddress ?? 'tez'
        }))
      )
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        showErrorToast('Exchange Rates not loaded');
      });

  const { data: exchangeRates } = useUpdateOnBlockSWR(['exchange-rates'], getExchangeRates, {
    refreshInterval: 30000
  });

  return exchangeRates as ExchangeRateEntry[] | undefined;
});
