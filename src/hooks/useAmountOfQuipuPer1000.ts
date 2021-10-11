import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';

import { STABLE_TOKEN } from '@utils/defaults';
import { useExchangeRates } from './useExchangeRate';

export const useAmountOfQuipuPer1000 = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [amountOfQuipuPer1000, setAmountOfQuipuPer1000] = useState<BigNumber[]>([]);
  const exchangeRates = useExchangeRates();

  const price = useMemo(() => (
    new BigNumber(exchangeRates && exchangeRates.find
      ? exchangeRates
        .find((e:any) => e.tokenAddress === STABLE_TOKEN.contractAddress)?.exchangeRate
      : NaN)
  ), [exchangeRates]);

  useEffect(() => {
    // setAmountOfQuipuPer1000(1000 * percentage / 100 / price);
  }, [price]);

  return amountOfQuipuPer1000;
};
