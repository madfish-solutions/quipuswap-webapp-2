import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

import { StableswapTokensInfo } from '../types';

export const calculateOutputWithLp = (
  lpInput: Nullable<BigNumber>,
  totalSupply: BigNumber,
  tokensInfo: Array<StableswapTokensInfo>
): Array<Nullable<BigNumber>> => {
  if (isNull(lpInput)) {
    return Array(tokensInfo.length).fill(null);
  }

  const lpInputBN = new BigNumber(lpInput);

  const tokenOutputs: Array<BigNumber> = tokensInfo.map(({ reserves }) =>
    lpInputBN.multipliedBy(reserves).dividedBy(totalSupply)
  );

  return tokenOutputs;
};
