import BigNumber from 'bignumber.js';

import { TEZOS_TOKEN } from '@config';

import { fromDecimals } from './from-decimals';

export const calculateRateAmount = (value: BigNumber.Value, xtzUsdQuote: string) =>
  fromDecimals(new BigNumber(value), TEZOS_TOKEN.metadata.decimals)
    .multipliedBy(new BigNumber(xtzUsdQuote))
    .integerValue()
    .toString();
