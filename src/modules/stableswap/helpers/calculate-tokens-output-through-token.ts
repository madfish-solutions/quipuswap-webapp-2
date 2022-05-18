import BigNumber from 'bignumber.js';

import { isEmptyString } from '@shared/helpers';

export const calculateTokensOutputsThrougToken = (
  input: string,
  inputAmountIndex: number,
  totalLpSupply: BigNumber,
  reserves: BigNumber[],
  currentIndex: number
) => {
  if (isEmptyString(input)) {
    return null;
  }

  const inputAmount = new BigNumber(input);

  const inputAmountReserves = reserves[inputAmountIndex];
  const shares_in = inputAmount.multipliedBy(totalLpSupply).dividedBy(inputAmountReserves);

  const currentReserves = reserves[currentIndex];

  return shares_in.multipliedBy(currentReserves).dividedBy(totalLpSupply);
};
