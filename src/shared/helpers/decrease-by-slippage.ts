import BigNumber from 'bignumber.js';

import { PERCENTAGE_BN } from '@config/constants';
import { toDecimals } from '@shared/helpers';

const BASE_BN = new BigNumber('1');

export const decreaseBySlippage = (amount: BigNumber, decimals: number, slippagePercentage: BigNumber) => {
  const fixedSlippage = BASE_BN.minus(slippagePercentage.dividedBy(PERCENTAGE_BN));

  return toDecimals(amount, decimals).multipliedBy(fixedSlippage).decimalPlaces(decimals, BigNumber.ROUND_DOWN);
};
