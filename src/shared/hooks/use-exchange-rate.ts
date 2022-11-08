import constate from 'constate';

import { EXCHANGE_RATES_URL } from '@config/config';
import { useTezos } from '@providers/use-dapp';

import useUpdateOnBlockSWR from './use-update-on-block-SWR';

interface RawExchangeRateEntry {
  tokenAddress?: string;
  tokenId?: number;
  exchangeRate: string;
}

interface ExchangeRateEntry extends RawExchangeRateEntry {
  tokenAddress: string;
}

/** deprecated */
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
      );

  const { data: exchangeRates } = useUpdateOnBlockSWR(tezos, ['exchange-rates'], getExchangeRates, {
    refreshInterval: 30000
  });

  return exchangeRates as ExchangeRateEntry[] | undefined;
});
