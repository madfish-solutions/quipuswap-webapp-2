import { StableFarmItem, StakerInfo } from '@modules/stableswap/types';
import { cloneArray, isNull, sortBigNumber, SortDirection } from '@shared/helpers';

import { StableswapFarmSortField } from '../types';

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
) => sortBigNumber(first.yourEarned, second.yourEarned, sortDirection);

const stableFarmingSorts = {
  [StableswapFarmSortField.ID]: sortById,
  [StableswapFarmSortField.APR]: sortByApr,
  [StableswapFarmSortField.APY]: sortByApy,
  [StableswapFarmSortField.TVL]: sortByTvl,
  [StableswapFarmSortField.DEPOSIT]: sortByDeposit,
  [StableswapFarmSortField.EARNED]: sortByEarned
};

const sortStableswapFarm = (
  first: StableFarmItem & StakerInfo,
  second: StableFarmItem & StakerInfo,
  sortField: StableswapFarmSortField,
  sortDirection: SortDirection
) => stableFarmingSorts[sortField](first, second, sortDirection);

export const sortStableswapFarmList = (
  list: Array<StableFarmItem & StakerInfo>,
  sortField: StableswapFarmSortField,
  sortDirection: SortDirection
) => {
  if (isNull(sortField)) {
    return list;
  }

  const localList = cloneArray(list);

  localList.sort((first, second) => sortStableswapFarm(first, second, sortField, sortDirection));

  return localList;
};
