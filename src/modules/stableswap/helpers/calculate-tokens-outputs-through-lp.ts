import BigNumber from 'bignumber.js';

export const calculateTokensOutputsThroughLp = (
  lpInput: BigNumber,
  totalSupply: BigNumber,
  reserves: Array<BigNumber>
): Array<Nullable<BigNumber>> => {
  if (lpInput.isNaN()) {
    return Array(reserves.length).fill(null);
  }

  const lpInputBN = new BigNumber(lpInput);

  const tokenOutputs: Array<BigNumber> = [];

  let tokenOutput: BigNumber;
  for (const reserve of reserves) {
    tokenOutput = lpInputBN.multipliedBy(reserve).dividedBy(totalSupply);
    tokenOutputs.push(tokenOutput);
  }

  return tokenOutputs;
};
