import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { LiquidityItemModel } from '../../../models';
import { LiquiditySortField } from '../types';

const sortByTvl = (first: LiquidityItemModel, second: LiquidityItemModel, sortDirection: SortDirection) =>
  sortBigNumber(first.item.tvlInUsd, second.item.tvlInUsd, sortDirection);

const stableswapSorts = {
  [LiquiditySortField.TVL]: sortByTvl
};

const sortStableswap = (
  first: LiquidityItemModel,
  second: LiquidityItemModel,
  sortField: LiquiditySortField,
  sortDirection: SortDirection
) => stableswapSorts[sortField](first, second, sortDirection);

export const sortLiquidityList = (
  list: Array<LiquidityItemModel>,
  sortField: LiquiditySortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStableswap(first, second, sortField, sortDirection));

  return localList;
};
