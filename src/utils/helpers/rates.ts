import BigNumber from 'bignumber.js';

const DECIMALS_FOR_BALANCES = 8;

export const divide = (input: BigNumber, output: BigNumber, decimals: number) =>
  output.div(input).decimalPlaces(decimals);

export const getRateByInputOutput = (input: BigNumber, output: BigNumber, decimals: number) =>
  divide(output, input, decimals);

export const getRateByBalances = (balanceTokenA: BigNumber, balanceTokenB: BigNumber) =>
  divide(balanceTokenA, balanceTokenB, DECIMALS_FOR_BALANCES);
