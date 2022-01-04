import constate from 'constate';

import { useTezos } from '@utils/dapp';

import { useFlowToasts } from './use-flow-toasts';
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
  const tezos = useTezos();
  const { showErrorToast } = useFlowToasts();

  const getExchangeRates = async () =>
    fetch('https://api.templewallet.com/api/exchange-rates')
      .then(async res => res.json())
      .then((rawExchangeRates: RawExchangeRateEntry[]) =>
        rawExchangeRates.map(({ tokenAddress, ...restProps }) => ({
          ...restProps,
          tokenAddress: tokenAddress ?? 'tez'
        }))
      )
      .catch(() => {
        showErrorToast('Exchange Rates not loaded');
      });

  const { data: exchangeRates } = useUpdateOnBlockSWR(tezos, ['exchange-rates'], getExchangeRates, {
    refreshInterval: 30000
  });

  return exchangeRates as ExchangeRateEntry[] | undefined;
});
