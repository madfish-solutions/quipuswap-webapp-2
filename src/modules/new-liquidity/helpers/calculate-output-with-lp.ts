import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

import { LiquidityTokenInfo } from '../interfaces';

interface TokenOutputWithDecimals {
  output: BigNumber;
  decimals: number;
}

export const calculateOutputWithLp = (
  shares: BigNumber,
  totalSupply: Nullable<BigNumber>,
  tokensInfo: Array<LiquidityTokenInfo>
): Array<Nullable<TokenOutputWithDecimals>> => {
  if (isNull(shares) || isNull(totalSupply)) {
    return tokensInfo.map(() => null);
  }

  const tokenOutputs: Array<TokenOutputWithDecimals> = tokensInfo.map(({ token, atomicTokenTvl }) => ({
    output: shares
      .multipliedBy(atomicTokenTvl)
      .idiv(totalSupply)
      .decimalPlaces(token.metadata.decimals, BigNumber.ROUND_DOWN),
    decimals: token.metadata.decimals
  }));

  return tokenOutputs;
};
