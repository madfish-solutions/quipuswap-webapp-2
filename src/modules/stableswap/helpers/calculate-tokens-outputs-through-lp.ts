import BigNumber from 'bignumber.js';

import { StableswapTokensInfo } from '../types';

export const calculateTokensOutputsThroughLp = (
  lpInput: BigNumber,
  totalSupply: BigNumber,
  tokensInfo: Array<StableswapTokensInfo>
): Array<Nullable<BigNumber>> => {
  if (lpInput.isNaN()) {
    return Array(tokensInfo.length).fill(null);
  }

  const lpInputBN = new BigNumber(lpInput);

  const tokenOutputs: Array<BigNumber> = tokensInfo.map(({ reserves }) =>
    lpInputBN.multipliedBy(reserves).dividedBy(totalSupply)
  );

  return tokenOutputs;
};
