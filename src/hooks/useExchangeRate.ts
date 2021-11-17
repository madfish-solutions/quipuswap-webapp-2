import constate from 'constate';
import useSWR from 'swr';

import { useOnBlock, useTezos } from '@utils/dapp';
import useUpdateToast from './useUpdateToast';

type ExchangeRateEntry = {
  tokenAddress: string,
  tokenId?: number,
  exchangeRate: string
};

export const [
  ExchangeRatesProvider,
  useExchangeRates,
] = constate(() => {
  const tezos = useTezos();
  const updateToast = useUpdateToast();

  const getExchangeRates = async () => fetch('https://api.templewallet.com/api/exchange-rates')
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => {
      updateToast({
        type: 'error',
        render: 'Exchange Rates not loaded',
      });
    });

  const { data: exchangeRates, revalidate } = useSWR(
    ['exchange-rates'],
    getExchangeRates,
    { refreshInterval: 30000 },
  );
  useOnBlock(tezos, revalidate);

  return exchangeRates as (ExchangeRateEntry[] | undefined);
});
