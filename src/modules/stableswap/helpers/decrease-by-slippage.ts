import BigNumber from 'bignumber.js';

import { toDecimals } from '@shared/helpers';

export const decreaseBySlippage = (amount: BigNumber, decimals: number, slippage: BigNumber) =>
  toDecimals(amount, decimals)
    .multipliedBy(new BigNumber('1').minus(slippage))
    .decimalPlaces(decimals, BigNumber.ROUND_DOWN);
