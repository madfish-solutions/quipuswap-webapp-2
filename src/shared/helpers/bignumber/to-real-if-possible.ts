import { BigNumber } from 'bignumber.js';

import { DECIMALS_BASE, FALLBACK_DECIMALS } from '@config/constants';
import { Optional, Token } from '@shared/types';

import { isExist } from '../type-checks';

export const toRealIfPossible = (
  atomic: Optional<BigNumber>,
  decimalsOrToken: Optional<number | Token>
): Nullable<BigNumber> => {
  if (!isExist(atomic)) {
    return null;
  }

  return atomic.dividedBy(
    new BigNumber(DECIMALS_BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS
    )
  );
};
