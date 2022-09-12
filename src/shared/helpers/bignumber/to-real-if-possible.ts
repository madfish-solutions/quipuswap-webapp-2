import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

import { isExist } from '../type-checks';

const BASE = 10;
const FALLBACK_DECIMALS = 0;

export const toRealIfPossible = (
  atomic: Optional<BigNumber>,
  decimalsOrToken: Optional<number | Token>
): Nullable<BigNumber> => {
  if (!isExist(atomic)) {
    return null;
  }

  return atomic.div(
    new BigNumber(BASE).pow(
      typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken?.metadata.decimals ?? FALLBACK_DECIMALS
    )
  );
};
