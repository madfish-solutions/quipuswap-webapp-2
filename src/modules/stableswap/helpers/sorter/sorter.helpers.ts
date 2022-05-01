import { StableswapItem, StableswapList } from '@modules/stableswap/types';
import { cloneArray, isNull, sortBigNumber } from '@shared/helpers';

import { SortDirection, SortField } from './sorter.types';

const sortById = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.id, second.id, sortDirection);
};

const sortByTvl = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);
};

const stableswapSorts = {
  [SortField.ID]: sortById,
  [SortField.TVL]: sortByTvl
};

const sortStableswap = (
  first: StableswapItem,
  second: StableswapItem,
  sortField: SortField,
  sortDirection: SortDirection
) => {
  return stableswapSorts[sortField](first, second, sortDirection);
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
