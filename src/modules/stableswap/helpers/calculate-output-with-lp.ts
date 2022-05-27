import BigNumber from 'bignumber.js';

import { StableswapTokensInfo } from '../types';

export const calculateOutputWithLp = (
  shares: BigNumber,
  totalSupply: BigNumber,
  tokensInfo: Array<StableswapTokensInfo>
): Array<BigNumber> => {
  const tokenOutputs: Array<BigNumber> = tokensInfo.map(({ reserves }) =>
    shares.multipliedBy(reserves).dividedBy(totalSupply)
  );

  return tokenOutputs;
};
