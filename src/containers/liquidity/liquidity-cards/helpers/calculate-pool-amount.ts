import BigNumber from 'bignumber.js';

import { calculateTokenAmount } from '@containers/liquidity/liquidity-cards/helpers/calculate-token-amount';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

export const calculatePoolAmount = (
  amountTokenA: BigNumber,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>,
  tokenAPool: Nullable<BigNumber>,
  tokenBPool: Nullable<BigNumber>
): Nullable<BigNumber> => {
  if (!tokenAPool || !tokenBPool || !tokenA || !tokenB) {
    return null;
  }

  const pureRate = calculateTokenAmount(fromDecimals(tokenAPool, tokenA), fromDecimals(tokenBPool, tokenB));

  const amount = amountTokenA.multipliedBy(pureRate);

  return amount.decimalPlaces(tokenB.metadata.decimals, BigNumber.ROUND_DOWN);
};
