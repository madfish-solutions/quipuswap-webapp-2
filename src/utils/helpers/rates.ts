import BigNumber from 'bignumber.js';

const DECIMALS_FOR_BALANCES = 2;

export const div = (input: BigNumber, output: BigNumber, decimals: number) => output.div(input).decimalPlaces(decimals);

export const getRateByInputOutput = (input: BigNumber, output: BigNumber, decimals: number) =>
  div(output, input, decimals);

export const getRateByBalances = (balanceTokenA: BigNumber, balanceTokenB: BigNumber) =>
  div(balanceTokenA, balanceTokenB, DECIMALS_FOR_BALANCES);
