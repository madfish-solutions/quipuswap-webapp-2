import constate from 'constate';

import { EXCHANGE_RATES_URL } from '@config/config';
import { useTezos } from '@providers/use-dapp';
import { jsonFetch } from '@shared/api';

import useUpdateOnBlockSWR from './use-update-on-block-SWR';

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

  const getExchangeRates = async () => {
    const rawExchangeRates = await jsonFetch<RawExchangeRateEntry[]>(EXCHANGE_RATES_URL);

    return rawExchangeRates.map(({ tokenAddress, ...restProps }) => ({
      ...restProps,
      tokenAddress: tokenAddress ?? 'tez'
    }));
  };

  const { data: exchangeRates } = useUpdateOnBlockSWR(tezos, ['exchange-rates'], getExchangeRates, {
    refreshInterval: 30000
  });

  return exchangeRates as ExchangeRateEntry[] | undefined;
});
