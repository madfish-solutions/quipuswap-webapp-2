import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { StakingItem } from '@interfaces/staking.interfaces';
import { isNull, cloneArray } from '@utils/helpers';
import { multipliedIfPossible } from '@utils/helpers/multiplied-if-possible';

import { SortDirection, SortField } from './sorter.types';

const SWAP = 1;
const SKIP = -1;

const sortBigNumber = (first: Nullable<BigNumber>, second: Nullable<BigNumber>, sortDirection: SortDirection) => {
  if (isNull(first)) {
    return SWAP;
  }

  if (isNull(second)) {
    return SKIP;
  }

  const isFirstBigger = first.isGreaterThan(second);
  const isSortedAsc = sortDirection === SortDirection.ASC;

  if ((isSortedAsc && isFirstBigger) || (!isSortedAsc && !isFirstBigger)) {
    return SWAP;
  }

  return SKIP;
};

const sortById = (first: StakingItem, second: StakingItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.id, second.id, sortDirection);
};

const sortByApr = (first: StakingItem, second: StakingItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.apr, second.apr, sortDirection);
};

const sortByApy = (first: StakingItem, second: StakingItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.apy, second.apy, sortDirection);
};

const sortByTvl = (first: StakingItem, second: StakingItem, sortDirection: SortDirection) => {
  return sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortDirection);
};

const sortByBalance = (first: StakingItem, second: StakingItem, sortDirection: SortDirection) => {
  const balanceA = multipliedIfPossible(first.myBalance, first.depositExchangeRate);
  const balanceB = multipliedIfPossible(second.myBalance, second.depositExchangeRate);

  return sortBigNumber(balanceA, balanceB, sortDirection);
};

const sortByDeposit = (first: StakingItem, second: StakingItem, sortDirection: SortDirection) => {
  const depositA = multipliedIfPossible(first.depositBalance, first.depositExchangeRate);
  const depositB = multipliedIfPossible(second.depositBalance, second.depositExchangeRate);

  return sortBigNumber(depositA, depositB, sortDirection);
};

const sortByEarned = (first: StakingItem, second: StakingItem, sortDirection: SortDirection) => {
  const earnA = multipliedIfPossible(first.earnBalance, first.earnExchangeRate);
  const earnB = multipliedIfPossible(second.earnBalance, second.earnExchangeRate);

  return sortBigNumber(earnA, earnB, sortDirection);
};

const stakingSorts = {
  [SortField.ID]: sortById,
  [SortField.APR]: sortByApr,
  [SortField.APY]: sortByApy,
  [SortField.TVL]: sortByTvl,
  [SortField.BALANCE]: sortByBalance,
  [SortField.DEPOSIT]: sortByDeposit,
  [SortField.EARNED]: sortByEarned
};

const sortStaking = (first: StakingItem, second: StakingItem, sortField: SortField, sortDirection: SortDirection) => {
  return stakingSorts[sortField](first, second, sortDirection);
};

export const sortStakingList = (list: Array<StakingItem>, sortField: SortField, sortDirection: SortDirection) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStaking(first, second, sortField, sortDirection));

  return localList;
};
