import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { StableswapItem } from '../../../../types';
import { StableswapSortField } from '../types';

const sortById = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) =>
  sortBigNumber(first.id, second.id, sortDirection);

const sortByTvl = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) =>
  sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const stableswapSorts = {
  [StableswapSortField.ID]: sortById,
  [StableswapSortField.TVL]: sortByTvl
};

const sortStableswap = (
  first: StableswapItem,
  second: StableswapItem,
  sortField: StableswapSortField,
  sortDirection: SortDirection
) => stableswapSorts[sortField](first, second, sortDirection);

export const sortStableswapList = (
  list: Array<StableswapItem>,
  sortField: StableswapSortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStableswap(first, second, sortField, sortDirection));

  return localList;
};
