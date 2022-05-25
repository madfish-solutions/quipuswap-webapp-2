import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

import { StableswapTokensInfo } from '../types';

export const calculateOutputWithLp = (
  lpInput: Nullable<BigNumber>,
  totalSupply: BigNumber,
  tokensInfo: Array<StableswapTokensInfo>
): Array<Nullable<BigNumber>> => {
  if (isNull(lpInput)) {
    return tokensInfo.map(() => null);
  }

  const tokenOutputs: Array<BigNumber> = tokensInfo.map(({ reserves }) =>
    lpInput.multipliedBy(reserves).dividedBy(totalSupply)
  );

  return tokenOutputs;
};
