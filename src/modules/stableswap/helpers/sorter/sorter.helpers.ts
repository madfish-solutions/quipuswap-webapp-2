import BigNumber from 'bignumber.js';

import { StableswapItem, StableswapList } from '@modules/stableswap/types';
import { cloneArray, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { SortDirection, SortField } from './sorter.types';

const SWAP = 1;
const SKIP = -1;

const sortBigNumber = (first: Nullable<BigNumber>, second: Nullable<BigNumber>, sortDirection: SortDirection) => {
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

const sortById = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.id, second.id, sortDirection);
};

const sortByTvl = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);
};

const farmingSorts = {
  [SortField.ID]: sortById,
  [SortField.TVL]: sortByTvl
};

const sortStableswap = (
  first: StableswapItem,
  second: StableswapItem,
  sortField: SortField,
  sortDirection: SortDirection
) => {
  return farmingSorts[sortField](first, second, sortDirection);
};

export const sortStableswapList = (
  list: StableswapList['list'],
  sortField: SortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStableswap(first, second, sortField, sortDirection));

  return localList;
};
