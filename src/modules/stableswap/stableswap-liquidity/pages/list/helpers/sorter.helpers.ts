import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { StableswapItem } from '../../../../types';
import { StableswapLiquiditySortField } from '../types';

const sortById = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) =>
  sortBigNumber(first.id, second.id, sortDirection);

const sortByTvl = (first: StableswapItem, second: StableswapItem, sortDirection: SortDirection) =>
  sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const stableswapSorts = {
  [StableswapLiquiditySortField.ID]: sortById,
  [StableswapLiquiditySortField.TVL]: sortByTvl
};

const sortStableswap = (
  first: StableswapItem,
  second: StableswapItem,
  sortField: StableswapLiquiditySortField,
  sortDirection: SortDirection
) => stableswapSorts[sortField](first, second, sortDirection);

export const sortStableswapList = (
  list: Array<StableswapItem>,
  sortField: StableswapLiquiditySortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStableswap(first, second, sortField, sortDirection));

  return localList;
};
