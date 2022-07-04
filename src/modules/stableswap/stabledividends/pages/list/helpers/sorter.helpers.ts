import { StableDividendsItem, StakerInfo } from '@modules/stableswap/types';
import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { StableDividendsSortField } from '../types';

const sortById = (first: StableDividendsItem, second: StableDividendsItem, sortDirection: SortDirection) =>
  sortBigNumber(first.id, second.id, sortDirection);

const sortByApr = (first: StableDividendsItem, second: StableDividendsItem, sortDirection: SortDirection) =>
  sortBigNumber(first.apr, second.apr, sortDirection);

const sortByApy = (first: StableDividendsItem, second: StableDividendsItem, sortDirection: SortDirection) =>
  sortBigNumber(first.apy, second.apy, sortDirection);

const sortByTvl = (first: StableDividendsItem, second: StableDividendsItem, sortDirection: SortDirection) =>
  sortBigNumber(first.tvl, second.tvl, sortDirection);

const sortByDeposit = (
  first: StableDividendsItem & StakerInfo,
  second: StableDividendsItem & StakerInfo,
  sortDirection: SortDirection
) => sortBigNumber(first.yourDeposit, second.yourDeposit, sortDirection);

const sortByEarned = (
  first: StableDividendsItem & StakerInfo,
  second: StableDividendsItem & StakerInfo,
  sortDirection: SortDirection
) => sortBigNumber(first.yourEarned, second.yourEarned, sortDirection);

const stableDividendsingSorts = {
  [StableDividendsSortField.ID]: sortById,
  [StableDividendsSortField.APR]: sortByApr,
  [StableDividendsSortField.APY]: sortByApy,
  [StableDividendsSortField.TVL]: sortByTvl,
  [StableDividendsSortField.DEPOSIT]: sortByDeposit,
  [StableDividendsSortField.EARNED]: sortByEarned
};

const sortStableDividends = (
  first: StableDividendsItem & StakerInfo,
  second: StableDividendsItem & StakerInfo,
  sortField: StableDividendsSortField,
  sortDirection: SortDirection
) => stableDividendsingSorts[sortField](first, second, sortDirection);

export const sortStableDividendsList = (
  list: Array<StableDividendsItem & StakerInfo>,
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
