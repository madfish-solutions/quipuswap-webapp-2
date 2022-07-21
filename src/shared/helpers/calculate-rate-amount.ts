import { BigNumber } from 'bignumber.js';

import { TEZOS_TOKEN } from '@config/tokens';

import { toReal } from './bignumber';

export const calculateRateAmount = (value: BigNumber.Value, xtzUsdQuote: string) =>
  toReal(new BigNumber(value), TEZOS_TOKEN.metadata.decimals)
    .multipliedBy(new BigNumber(xtzUsdQuote))
    .integerValue()
    .toString();
