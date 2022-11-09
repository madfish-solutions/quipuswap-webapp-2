import { BigNumber } from 'bignumber.js';

import { DECIMALS_BASE, FALLBACK_DECIMALS } from '@config/constants';
import { Nullable, Optional, Token } from '@shared/types';

import { isNull } from '../type-checks';

export const toAtomicIfPossible = (
  real: Nullable<BigNumber>,
  decimalsOrToken: Optional<number | Token>
): Nullable<BigNumber> => {
  if (isNull(real)) {
    return null;
  }

  return real.multipliedBy(
    new BigNumber(DECIMALS_BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS
    )
  );
};
