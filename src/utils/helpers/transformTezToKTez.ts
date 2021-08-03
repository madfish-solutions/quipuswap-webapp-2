import BigNumber from 'bignumber.js';

import { prettyPrice } from './prettyPrice';

export const transformTezToKTez = (
  value: string | number,
  fraction: number = 3,
  xtzUsdQuote?: number,
) => {
  const transformValue = new BigNumber(value).div(10 ** 3);

  if (xtzUsdQuote) {
    return prettyPrice(+transformValue.multipliedBy(xtzUsdQuote), fraction);
  }

  return prettyPrice(+transformValue, fraction);
};
