import { useEffect, useState } from 'react';

import constate from 'constate';

import { useStakeList } from './stake.provider';

enum SortTypes {
  ARY = 'APY',
  TVL = 'TVL',
  BALANCE = 'BALANCE',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
}

interface SortParams {
  stakedOnly: boolean;
  activeOnly: boolean;
  ordered: Order;
  sortedBy: SortTypes;
}

const DEFAULT_SORT_PARAMS: SortParams = {
  stakedOnly: true,
  activeOnly: true,
  ordered: Order.DESC,
  sortedBy: SortTypes.TVL
};

const sortStakingListByParams = <T>(stakingList: Array<T>, params: SortParams): Array<T> => {
  return stakingList;
};

const filterStakingListByserchString = <T>(stakingList: Array<T>, search: string): Array<T> => {
  return stakingList;
};

const useStakeListData = () => {
  const listOfStaking = useStakeList();

  const [search, setSearch] = useState('');
  const [sortParams, setSortParams] = useState(DEFAULT_SORT_PARAMS);
  const [filteredStakingList, setFilteredStakingList] = useState<typeof listOfStaking>([]);

  useEffect(() => {
    const sorted = sortStakingListByParams(listOfStaking, sortParams);
    const filtered = filterStakingListByserchString(sorted, search);

    setFilteredStakingList(filtered);
  }, [listOfStaking, sortParams, search]);

  return {
    search: {
      search,
      setSearch
    },
    sortParams: {
      sortParams,
      setSortParams
    },
    filteredStakingList
  };
};

export const [StakeListDataProvider, useStakeSearch, useStakeSort, useSortedStakeList] = constate(
  useStakeListData,
  v => v.search,
  v => v.sortParams,
  v => v.filteredStakingList
);
