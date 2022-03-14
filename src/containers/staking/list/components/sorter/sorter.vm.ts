import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

import { SortValue, SortType } from './sorter.types';

const sortingValues = [
  { label: 'APR', value: SortType.APR, up: true },
  { label: 'APR', value: SortType.APR, up: false },
  { label: 'APY', value: SortType.APY, up: true },
  { label: 'APY', value: SortType.APY, up: false },
  { label: 'TVL', value: SortType.TVL, up: true },
  { label: 'TVL', value: SortType.TVL, up: false },
  { label: 'Balance', value: SortType.BALANCE, up: true },
  { label: 'Balance', value: SortType.BALANCE, up: false },
  { label: 'Deposit', value: SortType.DEPOSIT, up: true },
  { label: 'Deposit', value: SortType.DEPOSIT, up: false },
  { label: 'Earned', value: SortType.EARNED, up: true },
  { label: 'Earned', value: SortType.EARNED, up: false }
];

export const useSorterViewModel = () => {
  const stakingListStore = useStakingListStore();

  const onSorterChange = (value: unknown) => {
    return stakingListStore.onSorterChange(value as SortValue);
  };

  return {
    sortingValues,
    onSorterChange
  };
};
