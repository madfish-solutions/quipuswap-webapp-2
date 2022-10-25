import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { LiquidityItemModel } from '../models';
import { LiquiditySortField } from '../pages/list/types';

const sortById = (first: LiquidityItemModel, second: LiquidityItemModel, sortDirection: SortDirection) =>
  sortBigNumber(first.id, second.id, sortDirection);

const sortByTvl = (first: LiquidityItemModel, second: LiquidityItemModel, sortDirection: SortDirection) =>
  sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const sortings = {
  [LiquiditySortField.ID]: sortById,
  [LiquiditySortField.TVL]: sortByTvl
};

const sortLiquidity = (
  first: LiquidityItemModel,
  second: LiquidityItemModel,
  sortField: LiquiditySortField,
  sortDirection: SortDirection
) => sortings[sortField](first, second, sortDirection);

export const sortLiquidityList = (
  list: Array<LiquidityItemModel>,
  sortField: LiquiditySortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortLiquidity(first, second, sortField, sortDirection));

  return localList;
};
