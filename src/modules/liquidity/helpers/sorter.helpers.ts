import { sortBigNumber, SortDirection } from '@shared/helpers';

import { LiquidityItemModel } from '../models';
import { LiquiditySortField } from '../pages/list/types';

const sortByTvl = (first: LiquidityItemModel, second: LiquidityItemModel, sortDirection: SortDirection) =>
  sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const sortings = {
  [LiquiditySortField.TVL]: sortByTvl
};

export const sortLiquidityItems =
  (sortField: LiquiditySortField, sortDirection: SortDirection) =>
  (first: LiquidityItemModel, second: LiquidityItemModel) =>
    sortings[sortField](first, second, sortDirection);
