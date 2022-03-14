import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { StakingItem } from '@interfaces/staking.interfaces';
import { isNull, isExist } from '@utils/helpers';

import { SortValue, SortType } from './sorter.types';

const CHANGE = 1;
const SKIP = -1;

const sortBigNumber = (first: Nullable<BigNumber>, second: Nullable<BigNumber>, up: SortValue['up']) => {
  if (isNull(first)) {
    return CHANGE;
  }

  if (isNull(second)) {
    return SKIP;
  }

  const isFirstBigger = first.isGreaterThan(second);

  return up === isFirstBigger ? CHANGE : SKIP;
};

const sortApr = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  return sortBigNumber(first.apr, second.apr, sortValue.up);
};

const sortApy = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  return sortBigNumber(first.apy, second.apy, sortValue.up);
};

const sortTvl = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  return sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortValue.up);
};

const sortBalance = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  let balanceA = null;
  let balanceB = null;
  if (isExist(first.myBalance) && isExist(first.depositExchangeRate)) {
    balanceA = first.myBalance.multipliedBy(first.depositExchangeRate);
  }
  if (isExist(second.myBalance) && isExist(second.depositExchangeRate)) {
    balanceB = second.myBalance.multipliedBy(second.depositExchangeRate);
  }

  return sortBigNumber(balanceA, balanceB, sortValue.up);
};

const sortDeposit = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  let depositA = null;
  let depositB = null;
  if (isExist(first.depositBalance) && isExist(first.depositExchangeRate)) {
    depositA = first.depositBalance.multipliedBy(first.depositExchangeRate);
  }
  if (isExist(second.depositBalance) && isExist(second.depositExchangeRate)) {
    depositB = second.depositBalance.multipliedBy(second.depositExchangeRate);
  }

  return sortBigNumber(depositA, depositB, sortValue.up);
};

const sortEarned = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  let earnA = null;
  let earnB = null;
  if (isExist(first.earnBalance) && isExist(first.earnExchangeRate)) {
    earnA = first.earnBalance.multipliedBy(first.earnExchangeRate);
  }
  if (isExist(second.earnBalance) && isExist(second.earnExchangeRate)) {
    earnB = second.earnBalance.multipliedBy(second.earnExchangeRate);
  }

  return sortBigNumber(earnA, earnB, sortValue.up);
};

const stakingSorts = {
  [SortType.APR]: sortApr,
  [SortType.APY]: sortApy,
  [SortType.TVL]: sortTvl,
  [SortType.BALANCE]: sortBalance,
  [SortType.DEPOSIT]: sortDeposit,
  [SortType.EARNED]: sortEarned
};

const sortStaking = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  return stakingSorts[sortValue.value](first, second, sortValue);
};

export const sortStakingList = (list: Array<StakingItem>, sortValue: Nullable<SortValue>) => {
  if (isNull(sortValue)) {
    return list;
  }

  const localList = [...list];

  localList.sort((first, second) => sortStaking(first, second, sortValue));

  return localList;
};
