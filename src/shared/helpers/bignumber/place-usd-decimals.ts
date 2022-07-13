import BigNumber from 'bignumber.js';

import { USD_DECIMALS } from '@config/constants';

import { placeDecimals } from './place-decimals';

export const placeUSDDecimals = (amount: BigNumber, roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN) =>
  placeDecimals(amount, USD_DECIMALS, roundingMode);
