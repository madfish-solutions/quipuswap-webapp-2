import { BigNumber } from 'bignumber.js';

import { SKIP, SWAP } from '@config/constants';
import { multipliedIfPossible, sortBigNumber, SortDirection } from '@shared/helpers';

import { FarmingListItemWithBalances, FarmingSortField } from '../types';

const sortByDefault =
  (sortDirection: SortDirection) => (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) => {
    if (first.version !== second.version) {
      return first.version < second.version ? SWAP : SKIP;
    }

    return sortBigNumber(new BigNumber(first.id), new BigNumber(second.id), sortDirection);
  };

const sortByApr =
  (sortDirection: SortDirection) => (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) =>
    sortBigNumber(first.apr, second.apr, sortDirection);

const sortByApy =
  (sortDirection: SortDirection) => (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) =>
    sortBigNumber(first.apy, second.apy, sortDirection);

const sortByTvl =
  (sortDirection: SortDirection) => (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) =>
    sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);

const sortByBalance =
  (sortDirection: SortDirection) => (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) => {
    const balanceA = multipliedIfPossible(first.myBalance, first.depositExchangeRate);
    const balanceB = multipliedIfPossible(second.myBalance, second.depositExchangeRate);

    return sortBigNumber(balanceA, balanceB, sortDirection);
  };

const sortByDeposit =
  (sortDirection: SortDirection) => (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) => {
    const depositA = multipliedIfPossible(first.depositBalance, first.depositExchangeRate);
    const depositB = multipliedIfPossible(second.depositBalance, second.depositExchangeRate);

    return sortBigNumber(depositA, depositB, sortDirection);
  };

const sortByEarned =
  (sortDirection: SortDirection) => (first: FarmingListItemWithBalances, second: FarmingListItemWithBalances) => {
    const earnA = multipliedIfPossible(first.earnBalance, first.earnExchangeRate);
    const earnB = multipliedIfPossible(second.earnBalance, second.earnExchangeRate);

    return sortBigNumber(earnA, earnB, sortDirection);
  };

const getSortFunction = (sortField: FarmingSortField) => {
  switch (sortField) {
    case FarmingSortField.DEFAULT:
      return sortByDefault;
    case FarmingSortField.APR:
      return sortByApr;
    case FarmingSortField.APY:
      return sortByApy;
    case FarmingSortField.TVL:
      return sortByTvl;
    case FarmingSortField.BALANCE:
      return sortByBalance;
    case FarmingSortField.DEPOSIT:
      return sortByDeposit;
    case FarmingSortField.EARNED:
      return sortByEarned;
    default:
      throw new Error(`Unknown sort field: ${sortField}`);
  }
};

export const sortFarming = (sortField: FarmingSortField, sortDirection: SortDirection) =>
  getSortFunction(sortField)(sortDirection);
