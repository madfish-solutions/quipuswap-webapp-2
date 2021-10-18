import BigNumber from 'bignumber.js';

import { DEFAULT_DECIMALS } from '@utils/defaults';
import { prettyPrice } from './prettyPrice';

export const transformMutezToTez = (
  value: string | number,
  fraction: number = 3,
  xtzUsdQuote?: number,
  dec: number = DEFAULT_DECIMALS,
) => {
  const transformValue = new BigNumber(value).div(10 ** dec);

  if (xtzUsdQuote) {
    return prettyPrice(+transformValue.times(xtzUsdQuote), fraction);
  }

  return prettyPrice(+transformValue, fraction);
};
