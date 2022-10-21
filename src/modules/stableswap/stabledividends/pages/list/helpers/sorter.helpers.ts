import { StableswapDividendsItemModel } from '@modules/stableswap/models';
import { StakerInfo } from '@modules/stableswap/types';
import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { StableDividendsSortField } from '../types';

const sortById = (
  first: StableswapDividendsItemModel,
  second: StableswapDividendsItemModel,
  sortDirection: SortDirection
) => sortBigNumber(first.id, second.id, sortDirection);

const sortByApr = (
  first: StableswapDividendsItemModel,
  second: StableswapDividendsItemModel,
  sortDirection: SortDirection
) => sortBigNumber(first.maxApr, second.maxApr, sortDirection);

const sortByApy = (
  first: StableswapDividendsItemModel,
  second: StableswapDividendsItemModel,
  sortDirection: SortDirection
) => sortBigNumber(first.apy, second.apy, sortDirection);

const sortByTvl = (
  first: StableswapDividendsItemModel,
  second: StableswapDividendsItemModel,
  sortDirection: SortDirection
) => sortBigNumber(first.tvl, second.tvl, sortDirection);

const sortByDeposit = (
  first: StableswapDividendsItemModel & StakerInfo,
  second: StableswapDividendsItemModel & StakerInfo,
  sortDirection: SortDirection
) => sortBigNumber(first.yourDeposit, second.yourDeposit, sortDirection);

const sortByEarned = (
  first: StableswapDividendsItemModel & StakerInfo,
  second: StableswapDividendsItemModel & StakerInfo,
  sortDirection: SortDirection
) => sortBigNumber(first.yourEarnedInUsd, second.yourEarnedInUsd, sortDirection);

const stableDividendsingSorts = {
  [StableDividendsSortField.ID]: sortById,
  [StableDividendsSortField.APR]: sortByApr,
  [StableDividendsSortField.APY]: sortByApy,
  [StableDividendsSortField.TVL]: sortByTvl,
  [StableDividendsSortField.DEPOSIT]: sortByDeposit,
  [StableDividendsSortField.EARNED]: sortByEarned
};

const sortStableDividends = (
  first: StableswapDividendsItemModel & StakerInfo,
  second: StableswapDividendsItemModel & StakerInfo,
  sortField: StableDividendsSortField,
  sortDirection: SortDirection
) => stableDividendsingSorts[sortField](first, second, sortDirection);

export const sortStableDividendsList = (
  list: Array<StableswapDividendsItemModel & StakerInfo>,
  sortField: StableDividendsSortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStableDividends(first, second, sortField, sortDirection));

  return localList;
};
