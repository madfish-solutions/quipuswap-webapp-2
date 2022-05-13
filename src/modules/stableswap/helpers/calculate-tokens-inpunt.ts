import BigNumber from 'bignumber.js';

export const calculateTokensInputs = (
  inputAmount: BigNumber,
  inputAmountIndex: number,
  totalLpSupply: BigNumber,
  reserves: BigNumber[]
) => {
  const inputAmountReserves = reserves[inputAmountIndex];
  const shares_in = inputAmount.multipliedBy(totalLpSupply).dividedBy(inputAmountReserves);

  const outAmounts = [];

  let outAmount = new BigNumber('0');
  let reserve = new BigNumber('0');

  for (let index = 0; index < reserves.length; index++) {
    if (inputAmountIndex === index) {
      outAmounts.push(inputAmount.toFixed());
    } else {
      reserve = reserves[index];
      outAmount = shares_in.multipliedBy(reserve).dividedBy(totalLpSupply);

      outAmounts.push(outAmount.toFixed());
    }
  }

  return outAmounts;
};
