import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

import { LiquidityTokenInfo } from '../interfaces';

interface TokenOutputWithDecimals {
  output: BigNumber;
  decimals: number;
}

export const calculateOutputWithLp = (
  shares: Nullable<BigNumber>,
  totalSupply: BigNumber,
  tokensInfo: Array<LiquidityTokenInfo>
): Array<Nullable<TokenOutputWithDecimals>> => {
  if (isNull(shares)) {
    return tokensInfo.map(() => null);
  }

  const tokenOutputs: Array<TokenOutputWithDecimals> = tokensInfo.map(({ token, atomicTokenTvl }) => ({
    output: shares
      .multipliedBy(atomicTokenTvl)
      .dividedBy(totalSupply)
      .decimalPlaces(token.metadata.decimals, BigNumber.ROUND_DOWN),
    decimals: token.metadata.decimals
  }));

  return tokenOutputs;
};
