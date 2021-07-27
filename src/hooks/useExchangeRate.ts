import constate from 'constate';
import useSWR from 'swr';

import { useOnBlock, useTezos } from '@utils/dapp';

export const [
  ExchangeRatesProvider,
  useExchangeRates,
] = constate(() => {
  const tezos = useTezos();

  const getExchangeRates = async () => fetch('https://api.templewallet.com/api/exchange-rates')
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => ([]));

  const { data: exchangeRates, revalidate } = useSWR(
    ['exchange-rates'],
    getExchangeRates,
    { refreshInterval: 30000 },
  );
  useOnBlock(tezos, revalidate);

  return exchangeRates;
});
