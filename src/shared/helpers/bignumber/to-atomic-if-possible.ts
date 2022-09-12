import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

import { isNull } from '../type-checks';

const DECIMALS_BASE = 10;
const FALLBACK_DECIMALS = 0;

export const toAtomicIfPossible = (
  real: Nullable<BigNumber>,
  decimalsOrToken: Optional<number | Token>
): Nullable<BigNumber> => {
  if (isNull(real)) {
    return null;
  }

  return real.times(
    new BigNumber(DECIMALS_BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS
    )
  );
};
