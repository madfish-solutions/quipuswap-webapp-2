import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { StableswapTokensInfo } from '../types';

export const calculateOutputWithLp = (
  shares: BigNumber,
  totalSupply: BigNumber,
  tokensInfo: Array<StableswapTokensInfo>
): Array<Nullable<BigNumber>> => {
  if (isNull(shares)) {
    return tokensInfo.map(() => null);
  }

  const tokenOutputs: Array<BigNumber> = tokensInfo.map(({ reserves, token }) =>
    shares.multipliedBy(reserves).dividedBy(totalSupply).decimalPlaces(token.metadata.decimals)
  );

  return tokenOutputs;
};
