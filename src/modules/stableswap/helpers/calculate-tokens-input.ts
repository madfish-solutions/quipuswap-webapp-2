import BigNumber from 'bignumber.js';

import { isEmptyString } from '@shared/helpers';

export const calculateTokensInputs = (
  inputAmount: string,
  inputReserve: BigNumber,
  totalLpSupply: BigNumber,
  outputReserve: BigNumber
) => {
  if (isEmptyString(inputAmount)) {
    return null;
  }
  const inputAmountBN = new BigNumber(inputAmount);
  const sharesIn = inputAmountBN.multipliedBy(totalLpSupply).dividedBy(inputReserve);

  return sharesIn.multipliedBy(outputReserve).dividedBy(totalLpSupply);
};
