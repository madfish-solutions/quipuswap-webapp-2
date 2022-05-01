import { BigNumber } from 'bignumber.js';

import { SortDirection } from '@modules/stableswap/helpers';
import { Nullable } from '@shared/types';

import { isNull } from '../type-checks';

const SWAP = 1;
const SKIP = -1;

export const sortBigNumber = (
  first: Nullable<BigNumber>,
  second: Nullable<BigNumber>,
  sortDirection: SortDirection
) => {
  if (isNull(first)) {
    return SWAP;
  }

  if (isNull(second)) {
    return SKIP;
  }

  const isFirstBigger = first.isGreaterThan(second);
  const isSortedAsc = sortDirection === SortDirection.ASC;

  if ((isSortedAsc && isFirstBigger) || (!isSortedAsc && !isFirstBigger)) {
    return SWAP;
  }

  return SKIP;
};
