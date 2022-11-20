import { BigNumber } from 'bignumber.js';

import { SKIP, SWAP } from '@config/constants';
import { Nullable } from '@shared/types';

import { sort } from '../sort';
import { isNull } from '../type-checks';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

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

  return sort(isFirstBigger, sortDirection);
};
