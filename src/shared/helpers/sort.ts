import { SKIP, SWAP } from '@config/constants';

import { SortDirection } from './bignumber';

export const isDirectOrder = (sortDirection: SortDirection) => sortDirection === SortDirection.ASC;

export const sort = (isFirstBigger: boolean, sortDirection: SortDirection) => {
  const isSortedAsc = isDirectOrder(sortDirection);

  if ((isSortedAsc && isFirstBigger) || (!isSortedAsc && !isFirstBigger)) {
    return SWAP;
  }

  return SKIP;
};

export const sortStrings = (a: string, b: string, sortDirection: SortDirection) => sort(a > b, sortDirection);
export const sortNumbers = (a: number, b: number, sortDirection: SortDirection) => sort(a > b, sortDirection);
