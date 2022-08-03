import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { StableswapItemModel } from '../../../../models';
import { StableswapSortField } from '../types';

const sortById = (first: StableswapItemModel, second: StableswapItemModel, sortDirection: SortDirection) =>
  sortBigNumber(first.id, second.id, sortDirection);

const sortByTvl = (first: StableswapItemModel, second: StableswapItemModel, sortDirection: SortDirection) =>
  sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const stableswapSorts = {
  [StableswapSortField.ID]: sortById,
  [StableswapSortField.TVL]: sortByTvl
};

const sortStableswap = (
  first: StableswapItemModel,
  second: StableswapItemModel,
  sortField: StableswapSortField,
  sortDirection: SortDirection
) => stableswapSorts[sortField](first, second, sortDirection);

export const sortStableswapList = (
  list: Array<StableswapItemModel>,
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
