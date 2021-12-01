import constate from 'constate';

import { useTezos } from '@utils/dapp';
import useUpdateToast from './useUpdateToast';
import useUpdateOnBlockSWR from './useUpdateOnBlockSWR';

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

  const { data: exchangeRates } = useUpdateOnBlockSWR(
    tezos,
    ['exchange-rates'],
    getExchangeRates,
    { refreshInterval: 30000 },
  );

  return exchangeRates as (ExchangeRateEntry[] | undefined);
});
