import BigNumber from 'bignumber.js';

import { Optional } from '@utils/types';

export const getDollarEquivalent = (value: Optional<BigNumber.Value>, exchangeRate: Optional<BigNumber.Value>) =>
  value && exchangeRate ? new BigNumber(value).times(new BigNumber(exchangeRate)).toFixed() : null;
