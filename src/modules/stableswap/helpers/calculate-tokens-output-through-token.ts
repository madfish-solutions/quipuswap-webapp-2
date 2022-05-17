import BigNumber from 'bignumber.js';

export const calculateTokensOutputsThroughToken = (
  inputAmount: BigNumber,
  inputAmountIndex: number,
  totalLpSupply: BigNumber,
  reserves: BigNumber[]
) => {
  const inputAmountReserves: BigNumber = reserves[inputAmountIndex];
  const sharesOut: BigNumber = inputAmount.multipliedBy(totalLpSupply).dividedBy(inputAmountReserves);

  const outAmounts: Array<string> = [];

  let outAmount: BigNumber;
  let reserve: BigNumber;

  for (let index = 0; index < reserves.length; index++) {
    if (inputAmountIndex === index) {
      outAmounts.push(inputAmount.toFixed());
    } else {
      reserve = reserves[index];
      outAmount = sharesOut.multipliedBy(reserve).dividedBy(totalLpSupply);

      outAmounts.push(outAmount.toFixed());
    }
  }

  return outAmounts;
};
