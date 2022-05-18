import BigNumber from 'bignumber.js';

export const calculateTokensOutputsThrougToken = (
  input: BigNumber,
  inputAmountReserves: BigNumber,
  totalLpSupply: BigNumber,
  outReserve: BigNumber
) => {
  if (input.isNaN()) {
    return { lpValue: null, tokenValue: null };
  }

  const inputAmount = new BigNumber(input);

  const shares_in = inputAmount.multipliedBy(totalLpSupply).dividedBy(inputAmountReserves);

  const tokenValue = shares_in.multipliedBy(outReserve).dividedBy(totalLpSupply);

  return { lpValue: shares_in, tokenValue };
};
