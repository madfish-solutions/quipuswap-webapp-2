import BigNumber from 'bignumber.js';

import { isEmptyString } from '@shared/helpers';

export const calculateTokensOutputsThroughLp = (
  lpInput: string,
  totalSupply: BigNumber,
  reserves: Array<BigNumber>
) => {
  if (isEmptyString(lpInput)) {
    return [];
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
