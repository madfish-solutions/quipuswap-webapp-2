import BigNumber from 'bignumber.js';

export const divide = (input: BigNumber, output: BigNumber, decimals: number) =>
  output.div(input).decimalPlaces(decimals);

export const getRateByInputOutput = (input: BigNumber, output: BigNumber, decimals: number) =>
  divide(output, input, decimals);
