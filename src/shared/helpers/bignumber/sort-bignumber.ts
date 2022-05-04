import { BigNumber } from 'bignumber.js';

import { SWAP, SKIP } from '@config/constants';
import { Nullable } from '@shared/types';

import { isNull } from '../type-checks';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export const isDirrectOrder = (sortDirection: SortDirection) => sortDirection === SortDirection.ASC;

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
  const isSortedAsc = isDirrectOrder(sortDirection);

  if ((isSortedAsc && isFirstBigger) || (!isSortedAsc && !isFirstBigger)) {
    return SWAP;
  }

  return SKIP;
};
