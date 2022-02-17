import BigNumber from 'bignumber.js';

import { calculateTokenAmount } from '@containers/liquidity/liquidity-cards/helpers/calculate-token-amount';
import { Nullable, RawToken } from '@interfaces/types';
import { fromDecimals, isNull } from '@utils/helpers';

import { checkIsPoolEmpty } from './check-is-pool-empty';

export const calculatePoolAmount = (
  amountTokenA: BigNumber,
  tokenA: Nullable<RawToken>,
  tokenB: Nullable<RawToken>,
  tokenAPool: Nullable<BigNumber>,
  tokenBPool: Nullable<BigNumber>
): Nullable<BigNumber> => {
  if (isNull(tokenA) || isNull(tokenB) || checkIsPoolEmpty(tokenAPool) || checkIsPoolEmpty(tokenBPool)) {
    return null;
  }

  const pureRate = calculateTokenAmount(fromDecimals(tokenAPool, tokenA), fromDecimals(tokenBPool, tokenB));

  const amount = amountTokenA.multipliedBy(pureRate);

  return amount.decimalPlaces(tokenB.metadata.decimals, BigNumber.ROUND_DOWN);
};
