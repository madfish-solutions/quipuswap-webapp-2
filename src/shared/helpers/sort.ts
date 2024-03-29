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

export const sortStrings = (sortDirection: SortDirection) => (a: string, b: string) => sort(a > b, sortDirection);
export const sortNumbers = (sortDirection: SortDirection) => (a: number, b: number) => sort(a > b, sortDirection);
