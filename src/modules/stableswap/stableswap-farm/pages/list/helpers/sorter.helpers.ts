import { StableFarmItem, StakerInfo } from '@modules/stableswap/types';
import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { StableFarmSortField } from '../types';

const sortById = (first: StableFarmItem, second: StableFarmItem, sortDirection: SortDirection) =>
  sortBigNumber(first.id, second.id, sortDirection);

const sortByApr = (first: StableFarmItem, second: StableFarmItem, sortDirection: SortDirection) =>
  sortBigNumber(first.apr, second.apr, sortDirection);

const sortByApy = (first: StableFarmItem, second: StableFarmItem, sortDirection: SortDirection) =>
  sortBigNumber(first.apy, second.apy, sortDirection);

const sortByTvl = (first: StableFarmItem, second: StableFarmItem, sortDirection: SortDirection) =>
  sortBigNumber(first.tvl, second.tvl, sortDirection);

const sortByDeposit = (
  first: StableFarmItem & StakerInfo,
  second: StableFarmItem & StakerInfo,
  sortDirection: SortDirection
) => sortBigNumber(first.yourDeposit, second.yourDeposit, sortDirection);

const sortByEarned = (
  first: StableFarmItem & StakerInfo,
  second: StableFarmItem & StakerInfo,
  sortDirection: SortDirection
) => sortBigNumber(first.yourEarnedInUsd, second.yourEarnedInUsd, sortDirection);

const stableFarmingSorts = {
  [StableFarmSortField.ID]: sortById,
  [StableFarmSortField.APR]: sortByApr,
  [StableFarmSortField.APY]: sortByApy,
  [StableFarmSortField.TVL]: sortByTvl,
  [StableFarmSortField.DEPOSIT]: sortByDeposit,
  [StableFarmSortField.EARNED]: sortByEarned
};

const sortStableFarm = (
  first: StableFarmItem & StakerInfo,
  second: StableFarmItem & StakerInfo,
  sortField: StableFarmSortField,
  sortDirection: SortDirection
) => stableFarmingSorts[sortField](first, second, sortDirection);

export const sortStableFarmList = (
  list: Array<StableFarmItem & StakerInfo>,
  sortField: StableFarmSortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStableFarm(first, second, sortField, sortDirection));

  return localList;
};
