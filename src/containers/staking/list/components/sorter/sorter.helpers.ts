import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { StakingItem } from '@interfaces/staking.interfaces';
import { isNull, isExist } from '@utils/helpers';
import { Optional } from '@utils/types';

import { SortValue, SortType } from './sorter.types';

const CHANGE = 1;
const SKIP = -1;

const multipliedIfPossible = (first: Optional<BigNumber>, second: Optional<BigNumber>): Nullable<BigNumber> => {
  if (isExist(first) && isExist(second)) {
    return first.multipliedBy(second);
  }

  return null;
};

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
  const balanceA = multipliedIfPossible(first.myBalance, first.depositExchangeRate);
  const balanceB = multipliedIfPossible(second.myBalance, second.depositExchangeRate);

  return sortBigNumber(balanceA, balanceB, sortValue.up);
};

const sortDeposit = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  const depositA = multipliedIfPossible(first.depositBalance, first.depositExchangeRate);
  const depositB = multipliedIfPossible(second.depositBalance, second.depositExchangeRate);

  return sortBigNumber(depositA, depositB, sortValue.up);
};

const sortEarned = (first: StakingItem, second: StakingItem, sortValue: SortValue) => {
  const earnA = multipliedIfPossible(first.earnBalance, first.earnExchangeRate);
  const earnB = multipliedIfPossible(second.earnBalance, second.earnExchangeRate);

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
