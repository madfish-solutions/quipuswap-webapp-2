import { sortBigNumber, SortDirection } from '@shared/helpers';

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

export const sortLiquidityItems =
  (sortField: LiquiditySortField, sortDirection: SortDirection) =>
  (first: LiquidityItemModel, second: LiquidityItemModel) =>
    sortings[sortField](first, second, sortDirection);
