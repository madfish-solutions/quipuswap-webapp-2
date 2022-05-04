import { FarmingItem } from '@modules/farming/interfaces';
import { cloneArray, isNull, multipliedIfPossible, sortBigNumber, SortDirection } from '@shared/helpers';

import { SortField } from './sorter.types';

const sortById = (first: FarmingItem, second: FarmingItem, sortDirection: SortDirection) =>
  sortBigNumber(first.id, second.id, sortDirection);

const sortByApr = (first: FarmingItem, second: FarmingItem, sortDirection: SortDirection) =>
  sortBigNumber(first.apr, second.apr, sortDirection);

const sortByApy = (first: FarmingItem, second: FarmingItem, sortDirection: SortDirection) =>
  sortBigNumber(first.apy, second.apy, sortDirection);

const sortByTvl = (first: FarmingItem, second: FarmingItem, sortDirection: SortDirection) =>
  sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const sortByBalance = (first: FarmingItem, second: FarmingItem, sortDirection: SortDirection) => {
  const balanceA = multipliedIfPossible(first.myBalance, first.depositExchangeRate);
  const balanceB = multipliedIfPossible(second.myBalance, second.depositExchangeRate);

  return sortBigNumber(balanceA, balanceB, sortDirection);
};

const sortByDeposit = (first: FarmingItem, second: FarmingItem, sortDirection: SortDirection) => {
  const depositA = multipliedIfPossible(first.depositBalance, first.depositExchangeRate);
  const depositB = multipliedIfPossible(second.depositBalance, second.depositExchangeRate);

  return sortBigNumber(depositA, depositB, sortDirection);
};

const sortByEarned = (first: FarmingItem, second: FarmingItem, sortDirection: SortDirection) => {
  const earnA = multipliedIfPossible(first.earnBalance, first.earnExchangeRate);
  const earnB = multipliedIfPossible(second.earnBalance, second.earnExchangeRate);

  return sortBigNumber(earnA, earnB, sortDirection);
};

const farmingSorts = {
  [SortField.ID]: sortById,
  [SortField.APR]: sortByApr,
  [SortField.APY]: sortByApy,
  [SortField.TVL]: sortByTvl,
  [SortField.BALANCE]: sortByBalance,
  [SortField.DEPOSIT]: sortByDeposit,
  [SortField.EARNED]: sortByEarned
};

const sortFarming = (first: FarmingItem, second: FarmingItem, sortField: SortField, sortDirection: SortDirection) => {
  return farmingSorts[sortField](first, second, sortDirection);
};

export const sortFarmingList = (list: Array<FarmingItem>, sortField: SortField, sortDirection: SortDirection) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortFarming(first, second, sortField, sortDirection));

  return localList;
};
