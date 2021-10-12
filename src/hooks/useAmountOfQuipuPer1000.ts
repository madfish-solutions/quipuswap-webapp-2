import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';

import { STABLE_TOKEN } from '@utils/defaults';
import { useExchangeRates } from './useExchangeRate';

export const useAmountOfQuipuPer1000 = (percentage: BigNumber, isOpen: boolean) => {
  const [amountOfQuipuPer1000, setAmountOfQuipuPer1000] = useState<BigNumber[]>();
  const exchangeRates = useExchangeRates();
  const oneThousand = new BigNumber(1000);

  const price = useMemo(() => (
    new BigNumber(exchangeRates && exchangeRates.find
      ? exchangeRates
        .find((e:any) => e.tokenAddress === STABLE_TOKEN.contractAddress)?.exchangeRate
      : NaN)
  ), [exchangeRates]);

  useEffect(() => {
    if (!percentage) return;
    if (!isOpen) return;

    const daily = percentage.dividedBy(365);
    const weekly = percentage.dividedBy(52);
    const monthly = percentage.dividedBy(12);

    setAmountOfQuipuPer1000([
      oneThousand
        .multipliedBy(daily)
        .dividedBy(100)
        .dividedBy(price),
      oneThousand
        .multipliedBy(weekly)
        .dividedBy(100)
        .dividedBy(price),
      oneThousand
        .multipliedBy(monthly)
        .dividedBy(100)
        .dividedBy(price),
      oneThousand
        .multipliedBy(percentage)
        .dividedBy(100)
        .dividedBy(price),
    ]);
  }, [price, isOpen]);

  return amountOfQuipuPer1000;
};
