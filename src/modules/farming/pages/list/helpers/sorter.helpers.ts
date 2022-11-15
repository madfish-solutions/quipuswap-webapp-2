import { BigNumber } from 'bignumber.js';

import { SKIP, SWAP } from '@config/constants';
import { multipliedIfPossible, sortBigNumber, SortDirection } from '@shared/helpers';

import { FarmingListItemWithBalances, FarmingSortField } from '../types';

const sortByDefault = (
  first: FarmingListItemWithBalances,
  second: FarmingListItemWithBalances,
  sortDirection: SortDirection
) => {
  if (first.version !== second.version) {
    return first.version < second.version ? SWAP : SKIP;
  }

  return sortBigNumber(new BigNumber(first.id), new BigNumber(second.id), sortDirection);
};

const sortByApr = (
  first: FarmingListItemWithBalances,
  second: FarmingListItemWithBalances,
  sortDirection: SortDirection
) => sortBigNumber(first.apr, second.apr, sortDirection);

const sortByApy = (
  first: FarmingListItemWithBalances,
  second: FarmingListItemWithBalances,
  sortDirection: SortDirection
) => sortBigNumber(first.apy, second.apy, sortDirection);

const sortByTvl = (
  first: FarmingListItemWithBalances,
  second: FarmingListItemWithBalances,
  sortDirection: SortDirection
) => sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const sortByBalance = (
  first: FarmingListItemWithBalances,
  second: FarmingListItemWithBalances,
  sortDirection: SortDirection
) => {
  const balanceA = multipliedIfPossible(first.myBalance, first.depositExchangeRate);
  const balanceB = multipliedIfPossible(second.myBalance, second.depositExchangeRate);

  return sortBigNumber(balanceA, balanceB, sortDirection);
};

const sortByDeposit = (
  first: FarmingListItemWithBalances,
  second: FarmingListItemWithBalances,
  sortDirection: SortDirection
) => {
  const depositA = multipliedIfPossible(first.depositBalance, first.depositExchangeRate);
  const depositB = multipliedIfPossible(second.depositBalance, second.depositExchangeRate);

  return sortBigNumber(depositA, depositB, sortDirection);
};

const sortByEarned = (
  first: FarmingListItemWithBalances,
  second: FarmingListItemWithBalances,
  sortDirection: SortDirection
) => {
  const earnA = multipliedIfPossible(first.earnBalance, first.earnExchangeRate);
  const earnB = multipliedIfPossible(second.earnBalance, second.earnExchangeRate);

  return sortBigNumber(earnA, earnB, sortDirection);
};

const farmingSorts = {
  [FarmingSortField.DEFAULT]: sortByDefault,
  [FarmingSortField.APR]: sortByApr,
  [FarmingSortField.APY]: sortByApy,
  [FarmingSortField.TVL]: sortByTvl,
  [FarmingSortField.BALANCE]: sortByBalance,
  [FarmingSortField.DEPOSIT]: sortByDeposit,
  [FarmingSortField.EARNED]: sortByEarned
};

export const sortFarming =
  (sortField: FarmingSortField, sortDirection: SortDirection) =>
  (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) =>
    farmingSorts[sortField](first, second, sortDirection);
