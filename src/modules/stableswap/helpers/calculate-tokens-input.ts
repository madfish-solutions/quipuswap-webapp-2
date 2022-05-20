import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

import { calculateLpValue } from './calculate-lp-value';

export const calculateTokensInputs = (
  inputAmount: Nullable<BigNumber>,
  inputAmountReserve: BigNumber,
  totalLpSupply: BigNumber,
  outputAmountReserve: BigNumber
) => {
  if (isNull(inputAmount)) {
    return null;
  }

  const lpValue = calculateLpValue(inputAmount, inputAmountReserve, totalLpSupply);

  return lpValue?.multipliedBy(outputAmountReserve).dividedBy(totalLpSupply) ?? null;
};
