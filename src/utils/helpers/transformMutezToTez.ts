import BigNumber from 'bignumber.js';

import { DEFAULT_DECIMALS } from '@utils/defaults';
import { prettyPrice } from './prettyPrice';

export const transformMutezToTez = (
  value: string | number,
  fraction: number = 3,
  xtzUsdQuote?: number,
  dec: number = DEFAULT_DECIMALS,
) => {
  const transformValue = new BigNumber(value).div(new BigNumber(10).pow(dec));

  if (xtzUsdQuote) {
    return prettyPrice(+transformValue.multipliedBy(xtzUsdQuote), fraction);
  }

  return prettyPrice(+transformValue, fraction);
};
