import BigNumber from 'bignumber.js';

import { defined, fromDecimals, isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { calculateTokenAmount } from './calculate-token-amount';
import { checkIsPoolEmpty } from './check-is-pool-empty';

export const calculatePoolAmount = (
  amountTokenA: BigNumber,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>,
  tokenAPool: Nullable<BigNumber>,
  tokenBPool: Nullable<BigNumber>
): Nullable<BigNumber> => {
  if (isNull(tokenA) || isNull(tokenB) || checkIsPoolEmpty(tokenAPool) || checkIsPoolEmpty(tokenBPool)) {
    return null;
  }

  const pureRate = calculateTokenAmount(
    fromDecimals(defined(tokenAPool), tokenA),
    fromDecimals(defined(tokenBPool), tokenB)
  );

  const amount = amountTokenA.multipliedBy(pureRate);

  return amount.decimalPlaces(tokenB.metadata.decimals, BigNumber.ROUND_DOWN);
};
