import BigNumber from 'bignumber.js';

export const calculateTokensInputs = (
  inputAmount: BigNumber,
  inputAmountReserve: BigNumber,
  totalLpSupply: BigNumber,
  outputAmountReserve: BigNumber
) => {
  if (inputAmount.isNaN()) {
    return null;
  }

  const shares_in = inputAmount.multipliedBy(totalLpSupply).dividedBy(inputAmountReserve);

  return shares_in.multipliedBy(outputAmountReserve).dividedBy(totalLpSupply);
};
