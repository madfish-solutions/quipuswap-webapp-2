import BigNumber from 'bignumber.js';

import { multipliedIfPossible, isNull } from '@shared/helpers';

import { calculateShares } from './calculate-lp-value';

export const calculateTokensInputs = (
  inputAmount: Nullable<BigNumber>,
  inputAmountReserve: BigNumber,
  totalLpSupply: BigNumber,
  outputAmountReserve: BigNumber
) => {
  if (isNull(inputAmount)) {
    return null;
  }

  const shares = calculateShares(inputAmount, inputAmountReserve, totalLpSupply);

  return multipliedIfPossible(shares, outputAmountReserve.dividedBy(totalLpSupply));
};
